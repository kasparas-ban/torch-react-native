export type ProfileResp = {
  user_id: string
  username: string
  email: string
  birthday: string | null
  gender: GenderType | null
  country_code: string | null
  city: string | null
  focus_time: number
  description: string | null
  created_at: string
  updated_at: string
  // Clocks
  focus_time__c: number
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
