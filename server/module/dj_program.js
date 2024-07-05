// 电台节目列表
function toBoolean(val) {
  if (typeof val === "boolean") return val
  if (val === "") return val
  return val === "true" || val == "1"
}
export default (query, request) => {
  const data = {
    radioId: query.rid,
    limit: query.limit || 30,
    offset: query.offset || 0,
    asc: toBoolean(query.asc),
  }
  return request(
    "POST",
    `https://music.163.com/weapi/dj/program/byradio`,
    data,
    {
      crypto: "weapi",
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    }
  )
}
