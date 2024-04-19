import React, { ReactNode } from "react"
import { ClerkProvider as Provider } from "@clerk/clerk-expo"
import * as SecureStore from "expo-secure-store"

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  if (!CLERK_KEY) throw new Error("Failed to load Clerk key")

  return (
    <Provider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      {children}
    </Provider>
  )
}
