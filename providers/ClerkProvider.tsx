import React, { ReactNode } from "react"
import { ClerkProvider as ExpoProvider } from "@clerk/clerk-expo"
import { ClerkProvider as WebProvider } from "@clerk/clerk-react"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (!item) await SecureStore.deleteItemAsync(key)
      return item
    } catch (error) {
      console.error("SecureStore get item error: ", error)
      await SecureStore.deleteItemAsync(key)
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

  if (Platform.OS === "web") {
    return <WebProvider publishableKey={CLERK_KEY}>{children}</WebProvider>
  }

  return (
    <ExpoProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      {children}
    </ExpoProvider>
  )
}
