export type ProfileResp = {
  userID: string
  username: string
  email: string
  birthday: string | null
  gender: GenderType | null
  countryCode: string | null
  city: string | null
  focusTime: number
  description: string | null
  createdAt: string
  updatedAt: string
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

export type SignUpUserData = {
  clerkID?: string
  username: string
  email: string
  password: string
  birthday: string | null
  gender: GenderType | null
  countryCode: string | null
  city: string | null
  description: string | null
}

export type UpdateProfileReq = {
  username: string
  birthday: string | null
  gender: GenderType | null
  countryCode: string | null
  city: string | null
  description: string | null
}

export type UpdateUserTime = {
  time_spent: number
}
