import config from "../utils/config"
// 点赞与取消点赞评论

export default(query, request) => {
  query.cookie.os = 'pc'
  query.t = query.t == 1 ? 'like' : 'unlike'
  query.type = config.resourceTypeMap[query.type]
  const data = {
    threadId: query.type + query.id,
    commentId: query.cid,
  }
  if (query.type == 'A_EV_2_') {
    data.threadId = query.threadId
  }
  return request(
    'POST',
    `https://music.163.com/weapi/v1/comment/${query.t}`,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
}