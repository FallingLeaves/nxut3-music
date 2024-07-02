import type { UseFetchOptions } from "#app"
import type { Privilege, Track } from "./playList"

export const TRACK_URL = {
  detail: "/song/detail",
}

interface TrackDetailRes {
  code: number
  songs: Track[]
  privileges: Privilege[]
}

export async function getTrackDetail(
  ids: string | string[],
  options?: UseFetchOptions<TrackDetailRes>
) {
  const fetchLatest = () => {
    return useHttp.get<TrackDetailRes>(
      TRACK_URL.detail,
      { ids },
      {
        ...options,
        transform(res) {
          res.songs.forEach((song) => {
            const privileges = res.privileges.find((v) => v.id === song.id)
            cacheTrackDetail(song, privileges!)
          })
          res.songs = mapTrackPlayableStatus(res.songs, res.privileges)
          return res
        },
      }
    )
  }
  let idsInArray = [String(ids)]
  if (typeof ids === "string") {
    idsInArray = ids.split(",")
  }

  fetchLatest()

  const result = await getTrackDetailFromCache(idsInArray)

  if (result) {
    result.songs = mapTrackPlayableStatus(result.songs, result.privileges)
    return result
  }

  const { data } = await fetchLatest()

  return unref(data)
}
