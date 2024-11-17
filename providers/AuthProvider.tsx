import { ReactNode, useEffect } from "react"
import useUserInfo from "@/stores/userStore"
import { AppState } from "react-native"
import { useAuth } from "@/lib/clerk"
import { getUserInfo } from "@/api/endpoints/userAPI"

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()
  const { setUser } = useUserInfo()

  useEffect(() => {
    // console.log("inside auth provider", !!user)

    const subscription = AppState.addEventListener("change", async state => {
      if (state === "active") {
        const token = await getToken()
        if (!token) return

        const userInfo = await getUserInfo(token)
        if (!userInfo) {
          setUser()
        }
        setUser(userInfo)
        console.log("App has come to the foreground!")
      }
    })

    return () => subscription.remove()
  }, [])

  return children
}
