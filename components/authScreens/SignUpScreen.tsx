import Colors from "@/constants/Colors"
import { useSignUp } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { LinearGradient } from "expo-linear-gradient"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"

import { AnimatedScrollView, useScrollViewHeader } from "../ScrollViewHeader"
import SelectCountry from "../SelectCountry"
import Button from "../UI/Button"
import DateInput from "../UI/DateInput"
import Link from "../UI/Link"
import Select from "../UI/Select"
import TextInput from "../UI/TextInput"

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  birthday: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
})

type SignUpFormType = z.infer<typeof SignUpSchema>

export default function SignUpScreen() {
  const isKeyboardOpen = useKeyboard()
  const { isLoaded, signUp, setActive } = useSignUp()
  const { styles, isDark } = useThemeStyles(componentStyles)

  const { scrollHandler, headerTitleStyle, headerGradientStyle } =
    useScrollViewHeader()

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    shouldUnregister: true,
  })

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    // try {
    //   await signUp.create({
    //     firstName,
    //     lastName,
    //     emailAddress,
    //     password,
    //   })

    //   // send the email.
    //   await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

    //   // change the UI to our pending section.
    //   setPendingVerification(true)
    // } catch (err: any) {
    //   console.error(JSON.stringify(err, null, 2))
    // }
  }

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    // try {
    //   const completeSignUp = await signUp.attemptEmailAddressVerification({
    //     code,
    //   })

    //   await setActive({ session: completeSignUp.createdSessionId })
    // } catch (err: any) {
    //   console.error(JSON.stringify(err, null, 2))
    // }
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedScrollView style={{ flex: 1 }} onScroll={scrollHandler}>
        <View style={{ marginTop: 40, marginLeft: 28, position: "absolute" }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginBottom: 12,
              marginTop: 40,
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
                  secureTextEntry
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
                <TextInput
                  placeholder="*********"
                  label="Password"
                  textContentType="password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children:
                      form.formState.errors.email &&
                      "Please enter your password",
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
                <TextInput
                  placeholder="*********"
                  label="Repeat password"
                  textContentType="password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children:
                      form.formState.errors.email &&
                      "Please enter your password",
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
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DateInput
                  placeholder={dayjs(new Date()).format("YYYY/MM/DD")}
                  label="Birthday"
                  onChange={onChange}
                  value={value}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Select"
                  label="Gender"
                  title="Select gender"
                  onChange={onChange}
                  value={value ?? undefined}
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                    { label: "Other", value: "OTHER" },
                  ]}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="country"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <SelectCountry
                  label="Country"
                  onChange={onChange}
                  value={value ?? undefined}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="city"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="City"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="About me"
                  multiline
                  numberOfLines={4}
                  maxLength={30}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
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
            paddingHorizontal: 24,
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
            <Link href="/(modals)/sign-in">Sign In</Link>
          </View>

          <Button scale={0.97} onPress={form.handleSubmit(onSignUpPress)}>
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
      height: 1100,
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
