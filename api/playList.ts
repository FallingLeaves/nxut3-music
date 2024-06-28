import type { UseFetchOptions } from "#app"

export const PLAYLIST_URL = {
  personalized: "/personalized",
  toplist: "/toplist",
  highquality: "/top/playlist/highquality",
  playlist: "/top/playlist",
  detail: "/playlist/detail",
}

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

export interface RecommendRes {
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
  return useHttp.get<RecommendRes>(PLAYLIST_URL.personalized, params, {
    ...options,
  })
}

interface TopItem {
  updateFrequency: string
  coverImgUrl: string
  name: string
  id: number
}

export interface TopListRes {
  code: number
  list: TopItem[]
}

/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 */
export function getToplists(options?: UseFetchOptions<TopListRes>) {
  return useHttp.get<TopListRes>(PLAYLIST_URL.toplist, undefined, {
    ...options,
  })
}

interface HighQualityParams extends Params {
  cat?: string
  before?: number
}

interface HighQualityItem {
  id: number
  name: string
  playCount: number
  coverImgUrl: string
}

export interface HighQualityRes {
  code: number
  more: boolean
  total: number
  playlists: HighQualityItem[]
}

/**
 * 获取精品歌单
 * 说明 : 调用此接口 , 可获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部", 可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 * @param {Object} params
 * @param {string} params.cat
 * @param {number=} params.limit
 * @param {number} params.before
 */
export function getHighQualityPlaylist(
  params?: HighQualityParams,
  options?: UseFetchOptions<HighQualityRes>
) {
  return useHttp.get<HighQualityRes>(PLAYLIST_URL.highquality, params, {
    ...options,
  })
}

interface TopPlayParams extends Params {
  order?: "new" | "hot"
  cat?: string
  offset?: number
}

interface TopPlayItem {
  id: number
  coverImgUrl: string
  name: string
}

export interface TopPlayRes {
  code: number
  more: boolean
  total: number
  playlists: TopPlayItem[]
}

/**
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 * @param {Object} params
 * @param {string} params.order
 * @param {string} params.cat
 * @param {number=} params.limit
 */
export function getTopPlaylist(
  params?: TopPlayParams,
  options?: UseFetchOptions<TopPlayRes>
) {
  return useHttp.get<TopPlayRes>(PLAYLIST_URL.playlist, params, {
    ...options,
  })
}

export interface Track {
  privilege?: any
  fee: number
  noCopyrightRcmd: any
  id: number
  playable?: boolean
  reason?: string
}

export interface Privilege {
  id: number
}

interface PlaylistDetail {
  id: number
  name: string
  coverImgUrl: string
  creator: {
    userId: number
    nickname: string
  }
  tracks: Track[]
  updateTime: number
  trackCount: number
  description: string
  subscribed: boolean
  privacy: number
}

interface PlaylistDetailRes {
  code: number
  playlist: PlaylistDetail
  privileges: Privilege[]
}

interface DetailParams {
  id: number
  timestamp?: number
}

/**
 * 获取歌单详情
 * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
 * 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口
 * 获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 * - id : 歌单 id
 * - s : 歌单最近的 s 个收藏者, 默认为8
 * @param {number} id
 * @param {boolean=} noCache
 */
export function getPlaylistDetail(
  id: number,
  noCache = false,
  options?: UseFetchOptions<PlaylistDetailRes>
) {
  let params: DetailParams = { id }
  if (noCache) params.timestamp = new Date().getTime()
  return useHttp.get<PlaylistDetailRes>(PLAYLIST_URL.detail, params, {
    ...options,
    transform(data) {
      if (data.playlist) {
        data.playlist.tracks = mapTrackPlayableStatus(
          data.playlist.tracks,
          data.privileges || []
        )
      }
      return data
    },
  })
}
