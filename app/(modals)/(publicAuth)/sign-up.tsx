import { useState } from "react"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Dimensions, Keyboard, StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { z } from "zod"
import { SignUpUserData } from "@/types/userTypes"
import { useSignUp } from "@/lib/clerk"
import { useRegisterUser } from "@/api/hooks/user/useUser"
import { CustomErrorData } from "@/api/utils/errorMsgs"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { formatDate } from "@/utils/utils"
import useSignUpData from "@/components/authComponents/SignUpStore"
import { notify } from "@/components/notifications/Notifications"
import PasswordInput from "@/components/PasswordInput"
import {
  AnimatedScrollView,
  useScrollViewHeader,
} from "@/components/ScrollViewHeader"
import SelectCountry from "@/components/SelectCountry"
import SelectGender from "@/components/SelectGender/SelectGender"
import Button from "@/components/UI/Button"
import DateInput from "@/components/UI/DateInput"
import Link from "@/components/UI/Link"
import TextInput from "@/components/UI/TextInput"

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const SignUpSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" })
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).*$/, {
        message:
          "Password must contain at least one number and both lowercase and uppercase characters",
      }),
    confirmPassword: z.string(),
    birthday: z.string().nullable(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    description: z.string().max(300).nullable(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignUpFormType = z.infer<typeof SignUpSchema>

export default function SignUpModal() {
  const isKeyboardOpen = useKeyboard()
  const { styles, isDark } = useThemeStyles(componentStyles)

  const { signUp } = useSignUp()
  const { setUserData } = useSignUpData()
  const [isLoading, setIsLoading] = useState(false)

  const { scrollHandler, headerTitleStyle, headerGradientStyle } =
    useScrollViewHeader()

  const defaultValues = {
    birthday: null,
    gender: null,
    country: null,
    city: null,
    description: null,
  }

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    shouldUnregister: true,
    defaultValues,
  })

  const onSignUpPress = async (data: SignUpFormType) => {
    Keyboard.dismiss()
    setIsLoading(true)

    const userData: SignUpUserData = {
      username: data.username,
      email: data.email,
      password: data.password,
      birthday: data.birthday ? formatDate(new Date(data.birthday)) : null,
      gender: data.gender || null,
      countryCode: data.country || null,
      city: data.city || null,
      description: data.description || null,
    }

    try {
      await signUp?.create({
        username: data.username,
        password: data.password,
        emailAddress: data.email,
      })
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" })
      setUserData(userData)
      router.push("/(modals)/(publicAuth)/sign-up-confirm")
    } catch (e: any) {
      const errorData = e.errors
        ? { title: "Registration failed", description: e.errors[0].message }
        : (e.data as CustomErrorData)

      notify({
        title: errorData?.title || "Sign up failed",
        description: errorData?.description || "Try registering later",
        type: "ERROR",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedScrollView
        style={{ flex: 1 }}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 40, marginLeft: 48, position: "absolute" }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginBottom: 12,
              marginTop: 48,
              zIndex: 1,
            }}
          >
            <Animated.Text style={[styles.title, headerTitleStyle]}>
              Sign Up
            </Animated.Text>
          </View>
          <AnimatedLinearGradient
            colors={[
              isDark ? Colors.gray[900] : Colors.default.light,
              "transparent",
            ]}
            locations={[0.7, 1]}
            style={[
              {
                position: "absolute",
                top: 0,
                left: -60,
                right: 0,
                height: 140,
              },
              headerGradientStyle,
            ]}
          />
        </View>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <Controller
              name="username"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="Username"
                  textContentType="username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children:
                      form.formState.errors.username &&
                      "Please enter your username",
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children:
                      form.formState.errors.email && "Please enter your email",
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  placeholder="*********"
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children: form.formState.errors.password?.message,
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  placeholder="*********"
                  label="Repeat password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children: form.formState.errors.confirmPassword?.message,
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 14,
                gap: 12,
              }}
            >
              <View style={styles.optionalDivider} />
              <Text style={styles.optionalLabel}>Optional</Text>
              <View style={styles.optionalDivider} />
            </View>

            <Controller
              name="birthday"
              control={form.control}
              rules={{ required: false }}
              render={({ field: { onChange, value } }) => (
                <DateInput
                  placeholder={dayjs(new Date()).format("YYYY/MM/DD")}
                  label="Birthday"
                  onChange={onChange}
                  value={value ? new Date(value) : undefined}
                  maxDate={new Date()}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <SelectGender onChange={onChange} value={value} />
              )}
            />

            <Controller
              name="country"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <SelectCountry
                  label="Country"
                  onChange={onChange}
                  value={value}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="city"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="City"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || undefined}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="About me"
                  multiline
                  numberOfLines={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || undefined}
                  style={{
                    height: 120,
                    textAlignVertical: "top",
                    paddingTop: 12,
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />
          </View>
        </View>
      </AnimatedScrollView>

      {!isKeyboardOpen && (
        <View
          style={{
            position: "absolute",
            bottom: 28,
            width: "100%",
            paddingHorizontal: 48,
          }}
        >
          <LinearGradient
            colors={[
              "transparent",
              isDark ? Colors.gray[900] : Colors.default.light,
            ]}
            locations={[0.1, 0.3]}
            style={[
              {
                position: "absolute",
                top: -20,
                bottom: -28,
                left: -24,
                right: -24,
              },
            ]}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginTop: 18,
              marginBottom: 18,
              justifyContent: "center",
            }}
          >
            <Text style={styles.text}>Already have an account?</Text>
            <Link href="/(modals)/(publicAuth)/sign-in">Sign In</Link>
          </View>

          <Button
            scale={0.97}
            onPress={form.handleSubmit(onSignUpPress)}
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </View>
      )}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: "center",
      height: Dimensions.get("window").height + 200,
    },
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 24,
      maxWidth: 400,
      width: "100%",
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[400],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
    },
    text: {
      color: isDark ? Colors.gray[400] : Colors.gray[900],
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
    optionalDivider: {
      height: 1,
      flex: 1,
      backgroundColor: isDark ? Colors.gray[700] : Colors.gray[300],
    },
    optionalLabel: {
      color: Colors.gray[500],
    },
  })
