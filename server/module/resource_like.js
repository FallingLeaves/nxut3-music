// 点赞与取消点赞资源
import config from "../utils/config"

export default(query, request) => {
  query.cookie.os = 'android'
  query.t = query.t == 1 ? 'like' : 'unlike'
  query.type = config.resourceTypeMap[query.type]
  const data = {
    threadId: query.type + query.id,
  }
  if (query.type === 'A_EV_2_') {
    data.threadId = query.threadId
  }
  return request(
    'POST',
    `https://music.163.com/weapi/resource/${query.t}`,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
}
