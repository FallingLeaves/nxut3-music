import type { UseFetchOptions } from "#app"

interface Params {
  limit?: number
}

interface RecommendItem {
  id: number | string
  name: string
  picUrl: string
  playCount: number
  trackCount: number
}

interface RecommendRes {
  code: number
  result: RecommendItem[]
}

/**
 * 推荐歌单
 * 说明 : 调用此接口 , 可获取推荐歌单
 * - limit: 取出数量 , 默认为 30 (不支持 offset)
 * - 调用例子 : /personalized?limit=1
 * @param {Object} params
 * @param {number=} params.limit
 */
export function getRecommendPlaylist(
  params?: Params,
  options?: UseFetchOptions<RecommendRes>
) {
  return useHttp.get<RecommendRes>("/personalized", params, { ...options })
}
