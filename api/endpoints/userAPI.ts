import {
  AddUserReq,
  ProfileResp,
  SignUpUserData,
  UpdateProfileReq,
  UpdateUserTime,
} from "@/types/userTypes"

import { HOST } from "../utils/apiConfig"
import { handleFetch } from "../utils/helpers"

export const addUser = (token: string, user: AddUserReq) =>
  fetch(`${HOST}/add-user`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  }).then(res => res.json() as Promise<ProfileResp>)

export const confirmSignIn = async (
  token: string,
  data: {
    clerkId: string
    email: string
  }
) => {
  return fetch(`${HOST}/confirm-sign-in`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async res => {
    if (res.status !== 204) {
      const data = await res.json().catch(() => {
        throw Error("Failed to read data message")
      })
      throw Error(data.error)
    }
  })
}

export const registerUser = (user: SignUpUserData) =>
  fetch(`${HOST}/register-user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(res => handleFetch<ProfileResp>(res, "Failed to register user"))

export const updateUser = (token: string, user: UpdateProfileReq) =>
  fetch(`${HOST}/update-user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(res => handleFetch<ProfileResp>(res, "Failed to update user"))

export const updateUserTime = (token: string, user: UpdateUserTime) =>
  fetch(`${HOST}/update-user-progress`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  })

export const getUserInfo = (token: string) =>
  fetch(`${HOST}/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data as ProfileResp | undefined
  })

export const deleteAccount = (token: string) =>
  fetch(`${HOST}/delete-user`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async res => {
    if (!res.ok) throw new Error("Failed to delete the account")
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
