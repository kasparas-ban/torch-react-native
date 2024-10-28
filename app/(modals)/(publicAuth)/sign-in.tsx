import { useState } from "react"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { useSignIn } from "@/lib/clerk"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { notify } from "@/components/notifications/Notifications"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/UI/Button"
import Link from "@/components/UI/Link"
import TextInput from "@/components/UI/TextInput"

export default function SignInModal() {
  return <SignInScreen />
}
