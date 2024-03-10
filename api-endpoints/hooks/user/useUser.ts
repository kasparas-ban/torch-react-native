import { useAuth, useUser } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateProfileReq } from "@/types/userTypes"

// import { PasswordFormType } from "@/components/accountModals/PasswordChange/PasswordChangeForm"

import { updateUser, updateUserTime } from "../../endpoints/userAPI"
import { CustomError, UserUpdateServerErrorMsg } from "../../utils/errorMsgs"

export const useUpdateUser = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const fetcher = async (data: UpdateProfileReq) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")
      const updatedUser = await updateUser(token, data)

      return updatedUser
    } catch (err) {
      throw new CustomError(err as string, UserUpdateServerErrorMsg)
    }
  }

  return useMutation({
    mutationFn: (data: UpdateProfileReq) => fetcher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}

// export const useUpdateUserPassword = () => {
//   const { user } = useUser()
//   const queryClient = useQueryClient()

//   const fetcher = async (data: PasswordFormType) => {
//     try {
//       if (!user) throw new Error("User not found")
//       await user.updatePassword({
//         newPassword: data.newPassword,
//         signOutOfOtherSessions: true,
//       })
//     } catch (err) {
//       throw new CustomError(err as string, {
//         title: "Failed to update password",
//         description: "Try updating your password later.",
//       })
//     }
//   }

//   return useMutation({
//     mutationFn: (data: PasswordFormType) => fetcher(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] })
//     },
//   })
// }

export const useUpdateUserTime = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const fetcher = async (timeSpent: number) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")
      const updatedUser = await updateUserTime(token, { timeSpent })

      return updatedUser
    } catch (err) {
      throw new CustomError(err as string, {
        title: "Failed to update focus time",
        description: "Your last focus time will not be saved.",
      })
    }
  }

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}
