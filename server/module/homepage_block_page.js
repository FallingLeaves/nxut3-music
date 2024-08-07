// 首页-发现 block page
// 这个接口为移动端接口，首页-发现页，数据结构可以参考 https://github.com/hcanyz/flutter-netease-music-api/blob/master/lib/src/api/uncategorized/bean.dart#L259 HomeBlockPageWrap
// query.refresh 是否刷新数据
export default(query, request) => {
  query.cookie.os = 'ios'
  query.cookie.appver = '8.7.01'
  const data = { refresh: query.refresh || false, cursor: query.cursor }
  return request(
    'POST',
    `https://music.163.com/api/homepage/block/page`,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  )
}
