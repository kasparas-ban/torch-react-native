import { useEffect, useMemo, useState } from "react"
import { create } from "zustand"
import { useAuth, useSignIn, useUser } from "@/lib/clerk"
import { confirmSignIn } from "@/api/endpoints/userAPI"
import { notify } from "@/components/notifications/Notifications"

import InternalError from "./InternalError"

type State = {
  isSignInConfirmed: boolean
  setIsSignInConfirmed: (val: boolean) => void
}

export const authStore = create<State>(set => ({
  isSignInConfirmed: false,
  setIsSignInConfirmed: (val: boolean) =>
    set(() => ({
      isSignInConfirmed: val,
    })),
}))

let signInComplete = false

export const useClerkSignIn = () => {
  const { user } = useUser()
  const { getToken, signOut } = useAuth()
  const { signIn: clerkSignIn, isLoaded, setActive } = useSignIn()
  const isSignInConfirmed = authStore(state => state.isSignInConfirmed)
  const setIsSignedInConfirmed = authStore(state => state.setIsSignInConfirmed)
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
      throw new InternalError({
        title: "Server connection failed",
        description: "Make sure internet connection is available and try again",
      })
    }
  }

  useEffect(() => {
    if (
      isSignInConfirmed ||
      !user?.id ||
      !user.primaryEmailAddress?.emailAddress ||
      signInComplete
    ) {
      return
    }

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
          clerkId: user.id,
          email: user.primaryEmailAddress!.emailAddress,
        })
        setIsSignedInConfirmed(true)
        signInComplete = true
      } catch (e) {
        notify({
          title: "Internal error",
          description: "Sign in failed",
        })
        await signOut()
      } finally {
        setIsSignInLoading(false)
      }
    }

    confirmFn()
  }, [user])

  return { signIn, isLoaded, isLoading: isSignInLoading }
}

export function useCustomAuth() {
  const isSignInConfirmed = authStore(state => state.isSignInConfirmed)
  const setIsSignedInConfirmed = authStore(state => state.setIsSignInConfirmed)
  const defaultAuth = useAuth()
  const handleSignOut = async () => {
    setIsSignedInConfirmed(false)
    signInComplete = false
    try {
      await defaultAuth.signOut({
        sessionId: defaultAuth.sessionId || undefined,
      })
    } catch (e) {
      throw new InternalError({
        title: "Internal error",
        description: "Failed to logout",
      })
    }
  }

  const memoAuth = useMemo(
    () => ({ ...defaultAuth, signOut: handleSignOut }),
    [isSignInConfirmed]
  )

  return defaultAuth.isSignedIn ? memoAuth : defaultAuth
}
