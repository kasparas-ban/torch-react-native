import { useState } from "react"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Dimensions, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"
import { z } from "zod"
import { UpdateProfileReq } from "@/types/userTypes"
import { useUser } from "@/lib/clerk"
import useUserInfo, { useUpdateUser } from "@/api/hooks/user/useUser"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { formatDate } from "@/utils/utils"
import { notify } from "@/components/notifications/Notifications"
import {
  AnimatedScrollView,
  useScrollViewHeader,
} from "@/components/ScrollViewHeader"
import SelectCountry from "@/components/SelectCountry"
import SelectGender from "@/components/SelectGender/SelectGender"
import Button from "@/components/UI/Button"
import DateInput from "@/components/UI/DateInput"
import PictureInput from "@/components/UI/PictureInput"
import Select from "@/components/UI/Select"
import TextInput from "@/components/UI/TextInput"

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const ProfileSchema = z.object({
  avatarImage: z
    .any()
    .refine(
      file =>
        file?.mimeType
          ? ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file.mimeType
            )
          : true,
      ".jpg, .jpeg, .png and .webp files are accepted."
    )
    .nullable(),
  username: z.string(),
  birthday: z.string().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  description: z.string().max(300).nullable(),
})

type ProfileFormType = z.infer<typeof ProfileSchema>

export default function EditProfileScreen() {
  const isKeyboardOpen = useKeyboard()
  const { styles, isDark } = useThemeStyles(componentStyles)

  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync } = useUpdateUser()
  const { data: userInfo } = useUserInfo()
  const { user } = useUser()

  const { scrollHandler, headerTitleStyle, headerGradientStyle } =
    useScrollViewHeader()

  const defaultValues = {
    avatarImage: user?.hasImage ? user.imageUrl : null,
    username: userInfo?.username,
    birthday: userInfo?.birthday,
    gender: userInfo?.gender,
    country: userInfo?.country_code,
    city: userInfo?.city,
    description: userInfo?.description,
  }

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    shouldUnregister: true,
    defaultValues,
  })

  const onSubmitPress = async (data: ProfileFormType) => {
    setIsLoading(true)
    const updatedProfile: UpdateProfileReq = {
      username: data.username,
      birthday: data.birthday ? formatDate(new Date(data.birthday)) : null,
      gender: data.gender || null,
      countryCode: data.country || null,
      city: data.city || null,
      description: data.description || null,
    }

    try {
      if (data?.avatarImage?.base64) {
        await user?.setProfileImage({
          file: data.avatarImage
            ? `${"data:image/png;base64,"}${data.avatarImage.base64}`
            : null,
        })
      }

      await mutateAsync(updatedProfile)
      router.replace("/(tabs)/account")
      notify({ title: "Profile info updated successfully" })
    } catch (e) {
      notify({
        title: "Failed to update profile",
        description: (e as any)?.errors?.[0]?.message,
        type: "ERROR",
      })
    } finally {
      setIsLoading(false)
    }
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
              marginTop: 50,
              zIndex: 1,
            }}
          >
            <Animated.Text style={[styles.title, headerTitleStyle]}>
              Edit profile
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
              name="avatarImage"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <PictureInput
                  label="Picture"
                  onChange={onChange}
                  value={value}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />

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
              name="birthday"
              control={form.control}
              rules={{ required: true }}
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
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <SelectGender onChange={onChange} value={value} />
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
              rules={{ required: true }}
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
              rules={{ required: true }}
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

          <Button
            scale={0.97}
            isLoading={isLoading}
            onPress={form.handleSubmit(onSubmitPress)}
          >
            Save
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
      height: Dimensions.get("window").height,
    },
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
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
