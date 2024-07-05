import config from "../utils/config"

export default(query, request) => {
  query.type = config.resourceTypeMap[query.type]
  const data = {
    parentCommentId: query.parentCommentId,
    threadId: query.type + query.id,
    time: query.time || -1,
    limit: query.limit || 20,
  }
  return request(
    "POST",
    `https://music.163.com/api/resource/comment/floor/get`,
    data,
    {
      crypto: "weapi",
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    }
  )
}
