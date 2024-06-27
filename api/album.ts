import type { UseFetchOptions } from "#app"

interface AlbumItem {
  id: number
  name: string
  picUrl: string
}

interface AlbumNewestRes {
  code: number
  albums: AlbumItem[]
}

/**
 * 说明 : 调用此接口 ，获取云音乐首页新碟上架数据
 * @param options
 * @returns
 */

export function getAlbumNewest(options?: UseFetchOptions<AlbumNewestRes>) {
  return useHttp.get<AlbumNewestRes>("/album/newest", undefined, { ...options })
}

interface Params {
  limit?: number
  offset?: number
  area?: "ALL" | "ZH" | "EA" | "KR" | "JP"
}

/**
 * 全部新碟
 * 说明 : 登录后调用此接口 ,可获取全部新碟
 * - limit - 返回数量 , 默认为 30
 * - offset - 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - area - ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 * @param {string} params.area
 */
export function getNewAlbums(
  params: Params,
  options?: UseFetchOptions<AlbumNewestRes>
) {
  return useHttp.get<AlbumNewestRes>("/album/new", params, { ...options })
}
