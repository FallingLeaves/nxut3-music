import type { UseFetchOptions } from "#app"

type Area = 1 | 2 | 3 | 4 | null

interface Params {
  type?: Area
}

interface ArtlistItem {
  id: number | string
  name: string
  img1v1Url: string
  picUrl: string
}

interface ArtlistRes {
  code: number
  list: {
    artists: ArtlistItem[]
  }
}

/**
 * 歌手榜
 * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
 * - type : 地区
 * 1: 华语
 * 2: 欧美
 * 3: 韩国
 * 4: 日本
 * @param {number=} type
 */
export function getToplistOfArtists(
  type: Area = null,
  options?: UseFetchOptions<ArtlistRes>
) {
  let params: Params = {}
  if (type) {
    params.type = type
  }
  return useHttp.get<ArtlistRes>("/toplist/artist", params, { ...options })
}
