// 登录刷新

export default async (query, request) => {
  let result = await request(
    'POST',
    `https://music.163.com/weapi/login/token/refresh`,
    {},
    {
      crypto: 'weapi',
      ua: 'pc',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
  if (result.code === 200) {
    result = {
      status: 200,
      body: {
        ...result,
        cookie: result.cookie.join(';'),
      },
      cookie: result.cookie,
    }
  }
  return result
}
