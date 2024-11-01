import { useMutation } from "@tanstack/react-query"
import { useCustomAuth } from "@/lib/useCustomAuth"

import { notifyUser } from "../../endpoints/userAPI"
import { CustomError, NotifyFetchErrorMsg } from "../../utils/errorMsgs"

export const useNotify = () => {
  const { getToken } = useCustomAuth()

  const fetcher = async (email: string) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")
      await notifyUser(token, email)
    } catch (err) {
      throw new CustomError(err as string, NotifyFetchErrorMsg)
    }
  }

  return useMutation({
    mutationFn: (email: string) => fetcher(email),
  })
}
