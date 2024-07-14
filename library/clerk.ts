import ClerkExpo from "@clerk/clerk-expo"
import ClerkWeb from "@clerk/clerk-react"
import { Platform } from "react-native"

const clerk = Platform.OS === "web" ? ClerkWeb : ClerkExpo

export const { useAuth, useUser, useSignUp, useSignIn } = clerk
