// 邮箱登录

import crypto from "crypto"

export default async (query, request) => {
  query.cookie.os = 'ios'
  query.cookie.appver = '8.7.01'
  const data = {
    username: query.email,
    password:
      query.md5_password ||
      crypto.createHash('md5').update(query.password).digest('hex'),
    rememberLogin: 'true',
  }
  let result = await request('POST', `https://music.163.com/api/login`, data, {
    crypto: 'weapi',
    ua: 'pc',
    cookie: query.cookie,
    proxy: query.proxy,
    realIP: query.realIP,
  })
  if (result.code === 502) {
    return {
      status: 200,
      body: {
        msg: '账号或密码错误',
        code: 502,
        message: '账号或密码错误',
      },
    }
  }
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
