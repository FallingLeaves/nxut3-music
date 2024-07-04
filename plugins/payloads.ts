export default definePayloadPlugin((nuxtApp) => {
  definePayloadReducer("Player", (data) => {
    return data instanceof Player && JSON.stringify(data.toJSON())
  })
  definePayloadReviver("Player", (data) => JSON.parse(data))
})
