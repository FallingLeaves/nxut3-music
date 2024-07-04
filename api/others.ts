import type { FMTrack } from "~/utils/Player"

export const OTHER_URL = {
  fm: "/personal_fm",
}

interface PersonFMRes {
  code: number
  data: FMTrack[]
}

export const getPersonFMClient = () => {
  return useAjax.get<PersonFMRes>(OTHER_URL.fm, {
    params: {
      timestamp: new Date().getTime(),
    },
  })
}
