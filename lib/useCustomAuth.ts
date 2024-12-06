import { useEffect, useState } from "react"
import { useAuth, useSignIn, useUser } from "@/lib/clerk"
import { confirmSignIn } from "@/api/endpoints/userAPI"
import useUserInfo from "@/api/hooks/user/useUser"
import { notify } from "@/components/notifications/Notifications"

import InternalError from "./InternalError"

let isSignInConfirmed = false

// export function useCustomAuth() {
//   const isUserSignedIn = useIsUserSignedIn()

//   const defaultAuth = useAuth()
//   const signedOutAuth = {
//     isLoaded: defaultAuth.isLoaded,
//     isSignedIn: false,
//     userId: undefined,
//     sessionId: undefined,
//     actor: undefined,
//     orgId: undefined,
//     orgRole: undefined,
//     orgSlug: undefined,
//     has: undefined,
//     signOut: async (_?: { sessionId?: string; redirectUrl?: string }) => {},
//     getToken: async () => {},
//   }

//   return isUserSignedIn ? defaultAuth : signedOutAuth
// }

// function useIsUserSignedIn() {
//   const { data: user } = useUserInfo()
//   const { isSignedIn } = useAuth()

//   return user ? isSignedIn : false
// }

export function useClerkSignIn() {
  const { user: clerkUser } = useUser()
  const { refetch } = useUserInfo()
  const { getToken, signOut } = useAuth()
  const { signIn: clerkSignIn, isLoaded, setActive } = useSignIn()
  const [isSignInLoading, setIsSignInLoading] = useState(false)

  const signIn = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    setIsSignInLoading(true)

    if (!clerkSignIn) {
      setIsSignInLoading(false)
      throw new InternalError({
        title: "Server connection failed",
        description: "Make sure internet connection is available and try again",
      })
    }

    try {
      const signInAttempt = await clerkSignIn.create({
        strategy: "password",
        identifier: email,
        password: password,
      })

      if (!signInAttempt.id || signInAttempt.status !== "complete") {
        throw new InternalError({
          title: "Sign in failed",
          description: "Try logging in later",
        })
      }

      await setActive({ session: signInAttempt.createdSessionId })
    } catch (e) {
      await signOut()
      setIsSignInLoading(false)
      throw new InternalError({ title: "Incorrect username or password" })
    }
  }

  useEffect(() => {
    const isUserDataValid =
      clerkUser?.id && clerkUser.primaryEmailAddress?.emailAddress
    if (!isUserDataValid || isSignInConfirmed) return

    // User logged in successfully - attempt to get user info from the DB
    // If it does not exist - create it

    const confirmFn = async () => {
      try {
        const token = await getToken()

        if (!token) {
          throw new InternalError({
            title: "Sign in failed",
            description: "Failed to authenticate request",
          })
        }

        await confirmSignIn(token, {
          clerkId: clerkUser!.id,
          email: clerkUser!.primaryEmailAddress!.emailAddress,
        })

        isSignInConfirmed = true
        refetch()
      } catch (e) {
        notify({
          title: "Internal error",
          description: "Server could not confirm sign in",
          type: "ERROR",
        })
        await signOut()
      } finally {
        setIsSignInLoading(false)
      }
    }

    confirmFn()
  }, [clerkUser])

  return { signIn, isLoaded, isLoading: isSignInLoading }
}
