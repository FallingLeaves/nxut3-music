import type { KeysOf, PickFrom } from "#app/composables/asyncData"
import type { AsyncData, UseFetchOptions } from "#app"
import type { FetchError, FetchResponse, SearchParameters } from "ofetch"
import { hash } from "ohash"

type UrlType =
  | string
  | Request
  | Ref<string | Request>
  | (() => string | Request)

function handleError<T>(_method: string | undefined, _response: any) {
  // Handle the error
}

function checkRef(obj: Record<string, any>) {
  return Object.keys(obj).some((key) => isRef(obj[key]))
}

function fetch<T>(url: UrlType, opts: UseFetchOptions<T>) {
  // Check the `key` option
  const { key, params, watch } = opts
  if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
    console.error(
      "\x1B[31m%s\x1B[0m %s",
      "[useHttp] [error]",
      "The `key` option is required when `params` or `watch` has ref properties, please set a unique key for the current request."
    )

  const options = opts
  options.lazy = options.lazy ?? true

  const { apiBase, prefix } = useRuntimeConfig().public

  return useFetch(url, {
    // Request interception
    onRequest({ options }) {
      console.log(process.client, process.server)
      let baseUrl = ""
      if (process.client) {
        baseUrl = prefix
      } else if (process.server) {
        baseUrl = apiBase
      }
      // Set the base URL
      options.baseURL = baseUrl
      // Set the request headers
      options.headers = new Headers(options.headers)
    },
    // Response interception
    onResponse(_context) {
      // Handle the response
    },
    // Error interception
    onResponseError({ response, options: { method } }) {
      handleError<T>(method, response)
    },
    // Set the cache key
    key: key ?? hash(["api-fetch", url, JSON.stringify(options)]),
    // Merge the options
    ...options,
  }) as AsyncData<PickFrom<T, KeysOf<T>>, FetchError<T> | null>
}

export const useHttp = {
  get: <T>(
    url: UrlType,
    params?: SearchParameters,
    option?: UseFetchOptions<T>
  ) => {
    return fetch<T>(url, { method: "get", params, ...option })
  },

  post: <T>(
    url: UrlType,
    body?: RequestInit["body"] | Record<string, any>,
    option?: UseFetchOptions<T>
  ) => {
    return fetch<T>(url, { method: "post", body, ...option })
  },

  put: <T>(
    url: UrlType,
    body?: RequestInit["body"] | Record<string, any>,
    option?: UseFetchOptions<T>
  ) => {
    return fetch<T>(url, { method: "put", body, ...option })
  },

  delete: <T>(
    url: UrlType,
    body?: RequestInit["body"] | Record<string, any>,
    option?: UseFetchOptions<T>
  ) => {
    return fetch<T>(url, { method: "delete", body, ...option })
  },
}
