import {
  AddUserReq,
  ProfileResp,
  RegisterUserReq,
  UpdateProfileReq,
  UpdateUserTime,
} from "@/types/userTypes"

import { HOST } from "../utils/apiConfig"
import { CustomError, ErrorResp } from "../utils/errorMsgs"

const handleFetch = async <T>(res: Response, errorMsg?: string) => {
  try {
    const data = (await res.json()) as T | ErrorResp
    if (!res.ok) {
      throw new Error(
        (data as ErrorResp)?.error || errorMsg || "Failed to reach the server"
      )
    }

    return data
  } catch (e) {
    throw new Error(e as string)
  }
}

export const addUser = (token: string, user: AddUserReq) =>
  fetch(`${HOST}/add-user`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  }).then(res => res.json() as Promise<ProfileResp>)

export const registerUser = (user: RegisterUserReq) =>
  fetch(`${HOST}/register-user`, {
    method: "POST",
    body: JSON.stringify(user),
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new CustomError(data.error, data)
  })

export const updateUser = (token: string, user: UpdateProfileReq) =>
  fetch(`${HOST}/update-user`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  }).then(res => handleFetch<ProfileResp>(res, "Failed to update user"))

export const updateUserTime = (token: string, user: UpdateUserTime) =>
  fetch(`${HOST}/update-user-progress`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  })

export const getUserInfo = (token: string) =>
  fetch(`${HOST}/user-info`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data as ProfileResp
  })

export const deleteAccount = (token: string) =>
  fetch(`${HOST}/delete-user`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
  })

export const notifyUser = (token: string, email: string) =>
  fetch(`${HOST}/notify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emailAddress: email }),
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
  })
