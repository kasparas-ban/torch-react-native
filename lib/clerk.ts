import * as ClerkExpo from "@clerk/clerk-expo"
import * as ClerkWeb from "@clerk/clerk-react"
import { Platform } from "react-native"

const clerk = Platform.OS === "web" ? ClerkWeb : ClerkExpo

export const { useAuth, useUser, useSignUp, useSignIn } = clerk
