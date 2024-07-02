import Dexie, { type EntityTable } from "dexie"
import type { Privilege, Track } from "~/api/playList"

interface TrackDetail {
  id: number
  updateTime: number
  detail: any
  privileges: any
}

interface Lyric {
  id: number
  updateTime: number
  lyrics: any
}

interface Album {
  id: number
  updateTime: number
  album: any
}

const db = new Dexie("nuxtmusic") as Dexie & {
  trackDetail: EntityTable<TrackDetail, "id">
  lyric: EntityTable<Lyric, "id">
  album: EntityTable<Album, "id">
  trackSources: EntityTable<TrackSources, "id">
}

interface TrackSources {
  name: string
  id: number
  createTime: number
  source: any
}

db.version(1).stores({
  trackDetail: "&id, updateTime",
  lyric: "&id, updateTime",
  album: "&id, updateTime",
  trackSources: "&id, createTime",
})

let tracksCacheBytes = 0

const deleteExcessCache = async () => {
  const settingStore = useSettingStore()
  if (
    settingStore.cacheLimit === false ||
    tracksCacheBytes < settingStore.cacheLimit * Math.pow(1024, 2)
  ) {
    return
  }
  try {
    const delCache = await db.trackSources.orderBy("createTime").first()
    await db.trackSources.delete(delCache?.id!)
    tracksCacheBytes -= delCache?.source.byteLength
    console.debug(
      `[debug][db.js] deleteExcessCacheSucces, track: ${delCache?.name}, size: ${delCache?.source.byteLength}, cacheSize:${tracksCacheBytes}`
    )
    deleteExcessCache()
  } catch (error) {}
}

export const getTrackDetailFromCache = (ids: string[]) => {
  return db.trackDetail
    .filter((track) => {
      return ids.includes(track.id + "")
    })
    .toArray()
    .then((tracks) => {
      const result: { songs: any[]; privileges: any[] } = {
        songs: [],
        privileges: [],
      }
      ids.forEach((id) => {
        const one = tracks.find((v) => v.id + "" === id)
        result.songs.push(one?.detail)
        result.privileges.push(one?.privileges)
      })
      if (result.songs.includes(undefined)) {
        return undefined
      }
      return result
    })
}

export const cacheTrackDetail = (track: Track, privileges: Privilege) => {
  db.trackDetail.put({
    id: track.id,
    detail: track,
    privileges: privileges,
    updateTime: new Date().getTime(),
  })
}
