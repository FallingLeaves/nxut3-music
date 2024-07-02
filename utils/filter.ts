import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"

export const formatDate = (timestamp: number, format = "YYYY年MM月DD日") => {
  if (!timestamp) return ""
  return dayjs(timestamp).format(format)
}

export const formatTime = (milliseconds: number, format = "HH:MM:SS") => {
  if (!milliseconds) return ""
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  let time = dayjs.duration(milliseconds)
  let hours = time.hours().toString()
  let mins = time.minutes().toString()
  let seconds = time.seconds().toString().padStart(2, "0")

  if (format === "HH:MM:SS") {
    return hours !== "0"
      ? `${hours}:${mins.padStart(2, "0")}:${seconds}`
      : `${mins}:${seconds}`
  } else if (format === "Human") {
    let hoursUnit = "小时",
      minitesUnit = "分钟"
    return hours !== "0"
      ? `${hours} ${hoursUnit} ${mins} ${minitesUnit}`
      : `${mins} ${minitesUnit}`
  }
}
