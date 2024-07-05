import type { Track } from "~/api/playList"
import { Howl, Howler } from "howler"
import { getPersonFMClient } from "~/api/others"
import type { AlbumItem } from "~/api/album"
import type { ArtlistItem } from "~/api/artist"

interface PlaylistSource {
  type: string
  id: number
}

export interface FMTrack {
  id: number
  name: string
  album: AlbumItem
  artists: ArtlistItem[]
}

type Mode = "off" | "on" | "one"

const UNPLAYABLE_CONDITION = {
  PLAY_NEXT_TRACK: "playNextTrack",
  PLAY_PREV_TRACK: "playPrevTrack",
}

export default class Player {
  private _playing = false
  private _progress = 0
  private _enabled = false
  private _repeatMode: Mode = "off"
  private _shuffle = false
  private _reversed = false
  private _volume = 1
  private _volumeBeforeMuted = 1
  private _personalFMLoading = false
  private _personalFMNextLoading = false

  private _list = []
  private _current = 0
  private _shuffledList = []
  private _shuffledCurrent = 0
  private _playlistSource: PlaylistSource = { type: "", id: 0 }
  private _currentTrack: Track | null = null
  private _playNextList = []
  private _isPersonalFM = false
  private _personalFMTrack: FMTrack | null = null
  private _personalFMNextTrack: FMTrack | null = null

  private _howler: Howl | null = null

  createdBlobRecords: string[] = []

  constructor() {
    // this._init()
  }

  get repeatMode() {
    return this._repeatMode
  }

  set repeatMode(mode) {
    if (this._isPersonalFM) {
      return
    }
    this._repeatMode = mode
  }

  get shuffle() {
    return this._shuffle
  }

  set shuffle(shuffle) {
    if (this._isPersonalFM) {
      return
    }
    this._shuffle = shuffle
    if (shuffle) {
      this._shuffleTheList()
    }
  }

  get reversed() {
    return this._reversed
  }

  set reversed(reversed) {
    if (this._isPersonalFM) {
      return
    }
    this._reversed = reversed
  }

  get volume() {
    return this._volume
  }

  set volume(volume) {
    this._volume = volume
    this._howler?.volume(volume)
  }

  get list() {
    return this.shuffle ? this._shuffledList : this._list
  }

  set list(list) {
    this._list = list
  }

  get current() {
    return this.shuffle ? this._shuffledCurrent : this._current
  }
  set current(current) {
    if (this.shuffle) {
      this._shuffledCurrent = current
    } else {
      this._current = current
    }
  }

  get enabled() {
    return this._enabled
  }

  get playing() {
    return this._playing
  }

  get currentTrack() {
    return this._currentTrack
  }

  get currentTrackID() {
    return this._currentTrack?.id ?? 0
  }

  get playlistSource() {
    return this._playlistSource
  }

  get playNextList() {
    return this._playNextList
  }

  get isPersonalFM() {
    return this._isPersonalFM
  }

  get personalFMTrack() {
    return this._personalFMTrack
  }

  get personalFMNextTrack() {
    return this._personalFMNextTrack
  }

  get currentTrackDuration() {
    const trackDuration = this._currentTrack?.dt || 1000
    let duration = ~~(trackDuration / 1000)
    return duration > 1 ? duration - 1 : duration
  }

  get progress() {
    return this._progress
  }

  set progress(value) {
    if (this._howler) {
      this._howler.seek(value)
    }
  }

  async _init() {
    if (this._howler) {
      this._howler?.volume(this.volume)
    }

    if (
      !this._personalFMTrack ||
      !this._personalFMNextTrack ||
      this._personalFMTrack?.id === this._personalFMNextTrack?.id
    ) {
      // 不知道为什么只有一条数据
      const data = await getPersonFMClient()
      this._personalFMTrack = data.data[0]
      this._personalFMNextTrack = data.data[1]
    }
  }

  private _shuffleTheList() {}

  toJSON() {
    return { ...this }
  }
}
