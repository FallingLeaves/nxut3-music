// 歌曲可用性

export default(query, request) => {
  const data = {
    ids: '[' + parseInt(query.id) + ']',
    br: parseInt(query.br || 999000),
  }
  return request(
    'POST',
    `https://music.163.com/weapi/song/enhance/player/url`,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  ).then((response) => {
    let playable = false
    if (response.code == 200) {
      if (response.data[0].code == 200) {
        playable = true
      }
    }
    if (playable) {
      response = { success: true, message: 'ok' }
      return response
    } else {
      // response.status = 404
      response = { success: false, message: '亲爱的,暂无版权' }
      return response
      // return Promise.reject(response)
    }
  })
}
