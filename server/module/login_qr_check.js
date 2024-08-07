export default async (query, request) => {
  const data = {
    key: query.key,
    type: 1,
  }
  try {
    let result = await request(
      'POST',
      `https://music.163.com/weapi/login/qrcode/client/login`,
      data,
      {
        crypto: 'weapi',
        cookie: query.cookie,
        proxy: query.proxy,
        realIP: query.realIP,
      },
    )
    result = {
      status: 200,
      body: {
        ...result,
        cookie: result.cookie.join(';'),
      },
      cookie: result.cookie,
    }
    return result
  } catch (error) {
    return {
      status: 200,
      body: {},
      cookie: result.cookie,
    }
  }
}
