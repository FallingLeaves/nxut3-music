import type { AlbumItem } from "~/api/album"
import type { Track, Privilege } from "~/api/playList"

const isAccountLoggedIn = () => false

export function isTrackPlayable(track: Track) {
  let result = {
    playable: true,
    reason: "",
  }
  if (track?.privilege?.pl > 0) {
    return result
  }
  // cloud storage judgement logic
  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isAccountLoggedIn()) {
      result.playable = true
    } else {
      result.playable = false
      result.reason = "VIP Only"
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false
    result.reason = "付费专辑"
  } else if (
    track.noCopyrightRcmd !== null &&
    track.noCopyrightRcmd !== undefined
  ) {
    result.playable = false
    result.reason = "无版权"
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false
    result.reason = "已下架"
  }
  return result
}

export function mapTrackPlayableStatus(
  tracks: Track[],
  privileges: Privilege[] = []
) {
  if (tracks?.length === undefined) return tracks
  return tracks.map((t) => {
    const privilege = privileges.find((item) => item.id === t.id) || {}
    if (t.privilege) {
      Object.assign(t.privilege, privilege)
    } else {
      t.privilege = privilege
    }
    let result = isTrackPlayable(t)
    t.playable = result.playable
    t.reason = result.reason
    return t
  })
}

export function splitSoundtrackAlbumTitle(title: string) {
  let keywords = [
    "Music from the Original Motion Picture Score",
    "The Original Motion Picture Soundtrack",
    "Original MGM Motion Picture Soundtrack",
    "Complete Original Motion Picture Score",
    "Original Music From The Motion Picture",
    "Music From The Disney+ Original Movie",
    "Original Music From The Netflix Film",
    "Original Score to the Motion Picture",
    "Original Motion Picture Soundtrack",
    "Soundtrack from the Motion Picture",
    "Original Television Soundtrack",
    "Original Motion Picture Score",
    "Music From the Motion Picture",
    "Music From The Motion Picture",
    "Complete Motion Picture Score",
    "Music from the Motion Picture",
    "Original Videogame Soundtrack",
    "La Bande Originale du Film",
    "Music from the Miniseries",
    "Bande Originale du Film",
    "Die Original Filmmusik",
    "Original Soundtrack",
    "Complete Score",
    "Original Score",
  ]
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue
    return {
      title: title
        .replace(`(${keyword})`, "")
        .replace(`: ${keyword}`, "")
        .replace(`[${keyword}]`, "")
        .replace(`- ${keyword}`, "")
        .replace(`${keyword}`, ""),
      subtitle: keyword,
    }
  }
  return {
    title: title,
    subtitle: "",
  }
}

export function splitAlbumTitle(title: string) {
  let keywords = [
    "Bonus Tracks Edition",
    "Complete Edition",
    "Deluxe Edition",
    "Deluxe Version",
    "Tour Edition",
  ]
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue
    return {
      title: title
        .replace(`(${keyword})`, "")
        .replace(`: ${keyword}`, "")
        .replace(`[${keyword}]`, "")
        .replace(`- ${keyword}`, "")
        .replace(`${keyword}`, ""),
      subtitle: keyword,
    }
  }
  return {
    title: title,
    subtitle: "",
  }
}

export const formatAlbumType = (type: string, album: AlbumItem) => {
  if (!type) return ""
  if (type === "EP/Single") {
    return album.size === 1 ? "Single" : "EP"
  } else if (type === "Single") {
    return "Single"
  } else if (type === "专辑") {
    return "Album"
  } else {
    return type
  }
}
