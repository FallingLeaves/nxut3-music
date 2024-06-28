export default defineNuxtPlugin(() => {
  const { apiBase, prefix } = useRuntimeConfig().public

  const $request = $fetch.create({
    baseURL: prefix,
    /** 请求拦截器 */
    onRequest: ({ options }) => {},
    /** 请求错误拦截器，比如服务器无法连接会触发 */
    onRequestError({ request, error }) {},
    /** 响应拦截器 */
    onResponse({ response }) {},
    /** 响应错误拦截器 */
    onResponseError(_context) {},
  })

  return {
    provide: {
      request: $request,
    },
  }
})
