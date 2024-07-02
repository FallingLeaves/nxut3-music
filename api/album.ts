import type { UseFetchOptions } from "#app"
import type { ArtlistItem } from "./artist"
import type { Track } from "./playList"

export const ALBUM_URL = {
  newest: "/album/newest",
  new: "/album/new",
  detail: "/album",
  dynamic: "/album/detail/dynamic",
}

export interface AlbumItem {
  id: number
  name: string
  picUrl: string
  artist: ArtlistItem
  type: string
  publishTime: number
  mark: number
  size: number
  description: string
  company?: string
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
  return useHttp.get<AlbumNewestRes>(ALBUM_URL.newest, undefined, {
    ...options,
  })
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
  return useHttp.get<AlbumNewestRes>(ALBUM_URL.new, params, { ...options })
}

export interface AlbumDetailRes {
  code: number
  album: AlbumItem
  songs: Track[]
}

/**
 * 获取专辑内容
 * 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
 * @param {number} id
 */
export async function getAlbumDetail(
  id: string,
  options?: UseFetchOptions<AlbumDetailRes>
) {
  const fetchLatest = () => {
    return useHttp.get<AlbumDetailRes>(
      ALBUM_URL.detail,
      { id },
      {
        ...options,
        transform(res) {
          cacheAlbum(+id, res)
          res.songs = mapTrackPlayableStatus(res.songs)
          return res
        },
      }
    )
  }

  fetchLatest()

  const result = await getAlbumFromCache(+id)

  if (result) {
    return result
  }

  const { data } = await fetchLatest()

  return unref(data)
}

interface DynamicAlbumRes {
  code: number
  isSub: boolean
}

export const getDynamicAlbum = async (
  id: string,
  options?: UseFetchOptions<DynamicAlbumRes>
) => {
  const params = { id, timestamp: new Date().getTime() }
  return useHttp.get<DynamicAlbumRes>(ALBUM_URL.dynamic, params, {
    ...options,
  })
}
