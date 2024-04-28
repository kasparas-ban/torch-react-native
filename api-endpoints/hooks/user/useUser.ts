import { getUserInfo, registerUser } from "@/api-endpoints/endpoints/userAPI"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ProfileResp,
  RegisterUserReq,
  UpdateProfileReq,
} from "@/types/userTypes"

import { updateUser, updateUserTime } from "../../endpoints/userAPI"
import { CustomError, UserUpdateServerErrorMsg } from "../../utils/errorMsgs"

export const useRegisterUser = () => {
  const fetcher = async (data: RegisterUserReq) => {
    try {
      await registerUser(data)
    } catch (err: any) {
      throw new CustomError(err, {
        title: "Registration failed",
        description: err.data.error,
        field: err.data.field.param_name,
      })
    }
  }

  return useMutation({
    mutationFn: (data: RegisterUserReq) => fetcher(data),
  })
}

// export const useUpdateUser = () => {
//   const { getToken } = useAuth()
//   const queryClient = useQueryClient()

//   const fetcher = async (data: UpdateProfileReq) => {
//     try {
//       const token = await getToken()
//       if (!token) throw new Error("Token not found")
//       const updatedUser = await updateUser(token, data)

//       return {
//         ...updatedUser,
//         updatedAt: new Date().toISOString(),
//         isSynced: true,
//       }
//     } catch (err) {
//       throw new CustomError(err as string, UserUpdateServerErrorMsg)
//     }
//   }

//   return useMutation({
//     networkMode: "always",
//     mutationFn: (data: UpdateProfileReq) => fetcher(data),
//     onMutate: async (data: UpdateProfileReq) => {
//       await queryClient.cancelQueries({ queryKey: ["user"] })

//       const oldData = queryClient.getQueryData(["user"]) as
//         | ProfileResp
//         | undefined

//       queryClient.setQueryData(["user"], {
//         ...oldData,
//         ...data,
//         updatedAt: new Date().toISOString(),
//         isSynced: false,
//       })
//     },
//     onSuccess: data => queryClient.setQueryData(["user"], data),
//   })
// }

// export const useUpdateUserTime = () => {
//   const { getToken } = useAuth()
//   const queryClient = useQueryClient()

//   const fetcher = async (timeSpent: number) => {
//     try {
//       const token = await getToken()
//       if (!token) throw new Error("Token not found")
//       const updatedUser = await updateUserTime(token, { timeSpent })

//       return updatedUser
//     } catch (err) {
//       throw new CustomError(err as string, {
//         title: "Failed to update focus time",
//         description: "Your last focus time will not be saved.",
//       })
//     }
//   }

//   return useMutation({
//     mutationFn: fetcher,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] })
//     },
//   })
// }

// export default function useUserInfo() {
//   const { getToken } = useAuth()

//   const fetchUserInfo = async () => {
//     const token = await getToken()
//     if (token) {
//       const userInfo = await getUserInfo(token)
//       return userInfo
//     }
//     throw Error("Failed to get user info")
//   }

//   return useQuery({
//     queryKey: ["user"],
//     queryFn: fetchUserInfo,
//     staleTime: Infinity,
//   })
// }
