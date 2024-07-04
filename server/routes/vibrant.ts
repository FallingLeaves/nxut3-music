// /server/api/vibrant.js
import Vibrant from "node-vibrant"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const imageUrl = query.url as string

  if (!imageUrl) {
    throw createError({
      statusCode: 400,
      message: "No image URL provided",
    })
  }

  try {
    const palette = await Vibrant.from(imageUrl).getPalette()
    return palette
  } catch (error) {
    console.error("Error extracting palette:", error)
    throw createError({
      statusCode: 500,
      message: "Failed to extract color palette",
    })
  }
})
