import modules from "../../module"
import * as encrypt from "../../utils/crypto"
import queryString from "querystring"

const chooseUserAgent = (ua) => {
  const userAgentList = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
    "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
  ]
  let index = 0
  if (typeof ua == "undefined")
    index = Math.floor(Math.random() * userAgentList.length)
  else if (ua == "mobile") index = Math.floor(Math.random() * 7)
  else if (ua == "pc") index = Math.floor(Math.random() * 5) + 8
  else return ua
  return userAgentList[index]
}

const createRequest = (method, url, data, options) => {
  let headers = { "User-Agent": chooseUserAgent(options.ua) }
  if (method.toUpperCase() == "POST") {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  }
  if (url.includes("music.163.com")) {
    headers["Referer"] = "https://music.163.com"
  }
  if (typeof options.cookie === "object")
    headers["Cookie"] = Object.keys(options.cookie)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(options.cookie[key])
      )
      .join("; ")
  else if (options.cookie) headers["Cookie"] = options.cookie

  if (options.crypto == "weapi") {
    let csrfToken = (headers["Cookie"] || "").match(/_csrf=([^(;|$)]+)/)
    data.csrf_token = csrfToken ? csrfToken[1] : ""
    data = encrypt.weapi(data)
    url = url.replace(/\w*api/, "weapi")
  } else if (options.crypto == "linuxapi") {
    data = encrypt.linuxapi({
      method: method,
      url: url.replace(/\w*api/, "api"),
      params: data,
    })
    headers["User-Agent"] =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
    url = "https://music.163.com/api/linux/forward"
  }
  return $fetch(url, {
    method,
    headers,
    body: queryString.stringify(data),
  })
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const slug = event.context.params.slug
  const cookies = parseCookies(event)
  const headers = getRequestHeaders(event)
  const query = getQuery(event)
  const question = modules["/" + slug]
  let res = { code: "404", msg: "无效路径" }
  if (question) {
    const newQuery = Object.assign({}, query, { cookie: cookies })
    res = await question(newQuery, createRequest)
  }

  return res
})
