import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SignUpUserData, UpdateProfileReq } from "@/types/userTypes"
import { useCustomAuth } from "@/lib/useCustomAuth"
import { getUserInfo, registerUser } from "@/api/endpoints/userAPI"

import { updateUser } from "../../endpoints/userAPI"
import { CustomError, UserUpdateServerErrorMsg } from "../../utils/errorMsgs"

export const useRegisterUser = () => {
  const fetcher = async (data: SignUpUserData) => {
    try {
      return await registerUser(data)
    } catch (err: any) {
      throw new CustomError(err, {
        title: "Registration failed",
        description: err.data.error,
        field: err.data.field.param_name,
      })
    }
  }

  return useMutation({
    mutationFn: (data: SignUpUserData) => fetcher(data),
  })
}

export const useUpdateUser = () => {
  const { getToken } = useCustomAuth()
  const queryClient = useQueryClient()

  const fetcher = async (data: UpdateProfileReq) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")
      return await updateUser(token, data)
    } catch (err) {
      throw new CustomError(err as string, UserUpdateServerErrorMsg)
    }
  }

  return useMutation({
    mutationFn: (data: UpdateProfileReq) => fetcher(data),
    onSuccess: data => queryClient.setQueryData(["user"], data),
  })
}

export default function useUserInfo() {
  const { getToken } = useCustomAuth()

  const fetchUserInfo = async () => {
    try {
      const token = await getToken()
      if (!token) throw Error("Failed to get user info")
      const userInfo = await getUserInfo(token)
      return userInfo
    } catch (e) {
      throw Error("Failed to get user info")
    }
  }

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  })
}
