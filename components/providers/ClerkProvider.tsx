import React, { ReactNode } from "react"
import { ClerkProvider as Provider } from "@clerk/clerk-expo"

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export function ClerkProvider({ children }: { children: ReactNode }) {
  if (!CLERK_KEY) {
    // TODO: show notification that data will not be saved remotely
    return children
  }

  return <Provider publishableKey={CLERK_KEY}>{children}</Provider>
}
