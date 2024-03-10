export type ProfileResp = {
  userID: string
  username: string
  email: string
  birthday: string | null
  gender: GenderType | null
  createdAt: string
  countryCode: string
  focusTime: number
}

type GenderType = "MALE" | "FEMALE" | "OTHER"

export type GenderOption =
  | { label: "Male"; value: "MALE" }
  | { label: "Female"; value: "FEMALE" }
  | { label: "Other"; value: "OTHER" }

export type AddUserReq = {
  username: string
  email: string
}

export type UpdateProfileReq = {
  username: string
  birthday?: string
  gender?: string
  countryCode?: string
}

export type UpdateUserTime = {
  timeSpent: number
}
