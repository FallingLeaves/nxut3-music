import type { FetchOptions } from "ofetch"

function fetch<T>(url: string, opt?: any) {
  const { apiBase, prefix } = useRuntimeConfig().public
  return $fetch<T>(url, {
    ...opt,
    /** 请求拦截器 */
    onRequest: ({ options }) => {
      let baseUrl = ""
      if (process.client) {
        baseUrl = prefix
      } else if (process.server) {
        baseUrl = apiBase
      }
      options.baseURL = baseUrl
    },
    /** 请求错误拦截器，比如服务器无法连接会触发 */
    onRequestError({ request, error }) {},
    /** 响应拦截器 */
    onResponse({ response }) {},
    /** 响应错误拦截器 */
    onResponseError(_context) {},
  })
}

export const useAjax = {
  get: <T>(url: string, options: FetchOptions) => {
    return fetch<T>(url, {
      method: "get",
      ...options,
    })
  },
}
