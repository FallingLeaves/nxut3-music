// 电台推荐类型

export default(query, request) => {
  return request(
    'POST',
    `https://music.163.com/weapi/djradio/home/category/recommend`,
    {},
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
}
