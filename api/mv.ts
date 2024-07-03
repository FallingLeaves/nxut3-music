import type { UseFetchOptions } from "#app"
import type { ArtlistItem, MvItem } from "./artist"

export const MV_URL = {
  detail: "/mv/detail",
  url: "/mv/url",
  simi: "/simi/mv",
}

interface Br {
  size: number
  br: number
  point: number
}

interface MvDetail {
  artistId: number
  artistName: string
  artists: ArtlistItem[]
  brs: Br[]
  id: number
  name: string
  cover: string
  playCount: number
  publishTime: string
}

export interface MvDetailRes {
  code: number
  data: MvDetail
  subed: boolean
}

/**
 * 获取 mv 数据
 * 说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 ,
 * 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 * - 调用例子 : /mv/detail?mvid=5436712
 * @param {number} mvid mv 的 id
 */
export const getMvDetail = (
  mvid: string | number,
  options?: UseFetchOptions<MvDetailRes>
) => {
  const params = { mvid }
  return useHttp.get<MvDetailRes>(MV_URL.detail, params, { ...options })
}

interface MvUrlItem {
  url: string
  r: number
}

interface MvUrlRes {
  code: number
  data: MvUrlItem
}

interface MvParams {
  id: number
  r: number
}

/**
 * mv 地址
 * 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * - id: mv id
 * - r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
 * - 调用例子 : /mv/url?id=5436712 /mv/url?id=10896407&r=1080
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.r
 */
export const getMvUrl = (
  params: MvParams,
  options?: UseFetchOptions<MvUrlRes>
) => {
  return useHttp.get<MvUrlRes>(MV_URL.url, params, { ...options })
}

interface SimiMvRes {
  code: number
  mvs: MvItem[]
}

/**
 * 相似 mv
 * 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
 * @param {number} mvid
 */
export const getSimiMv = (
  mvid: number,
  options?: UseFetchOptions<SimiMvRes>
) => {
  const params = { mvid }
  return useHttp.get<SimiMvRes>(MV_URL.simi, params, { ...options })
}
