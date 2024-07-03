import type { UseFetchOptions } from "#app"
import type { AlbumItem } from "./album"
import type { Track } from "./playList"

export const AETIST_URL = {
  artist: "/toplist/artist",
  album: "/artist/album",
  artists: "/artists",
  mv: "/artist/mv",
}

type Area = 1 | 2 | 3 | 4 | null

interface Params {
  type?: Area
}

export interface ArtlistItem {
  id: number | string
  name: string
  img1v1Url: string
  picUrl: string
  followed: boolean
  musicSize: number
  albumSize: number
  mvSize: number
  briefDesc: string
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
  return useHttp.get<ArtlistRes>(AETIST_URL.artist, params, { ...options })
}

interface ArtistAlbumParams {
  id: string
  limit?: number
  offset?: number
}

interface ArtistAlbumRes {
  code: number
  artist: ArtlistItem
  more: boolean
  hotAlbums: AlbumItem[]
}

/**
 * 获取歌手专辑
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
 * - id: 歌手 id
 * - limit: 取出数量 , 默认为 50
 * - offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.limit
 * @param {number=} params.offset
 */
export const getArtistAlbum = (
  params: ArtistAlbumParams,
  options?: UseFetchOptions<ArtistAlbumRes>
) => {
  return useHttp.get<ArtistAlbumRes>(AETIST_URL.album, params, {
    ...options,
  })
}

interface ArtistsRes {
  code: number
  more: boolean
  artist: ArtlistItem
  hotSongs: Track[]
}

/**
 * 获取歌手单曲
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
 * @param {number} id - 歌手 id, 可由搜索接口获得
 */
export const getArtists = (
  id: string,
  options?: UseFetchOptions<ArtistsRes>
) => {
  const params = { id }
  return useHttp.get<ArtistsRes>(AETIST_URL.artists, params, {
    ...options,
    transform(data) {
      data.hotSongs = mapTrackPlayableStatus(data.hotSongs)
      return data
    },
  })
}

export interface MvItem {
  artist: ArtlistItem
  id: number
  name: string
  imgUrl: string
  imgurl16v9: string
  cover?: string
  coverUrl?: string
  vid?: number
  title?: string
  publishTime: string
  artistName?: string
  artistId?: number
  creator?: any[]
}

interface MvParams {
  id: string
  limit?: number
  offset?: number
}

interface ArtistMvRes {
  code: number
  hasMore: boolean
  mvs: MvItem[]
}

export const getArtistMv = (
  params: MvParams,
  options?: UseFetchOptions<ArtistMvRes>
) => {
  return useHttp.get<ArtistMvRes>(AETIST_URL.mv, params, { ...options })
}
