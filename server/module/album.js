// 专辑内容

export default(query, request) => {
  return request(
    'POST',
    `https://music.163.com/weapi/v1/album/${query.id}`,
    {},
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
}
