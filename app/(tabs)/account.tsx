import { useMemo } from "react"
import useUserInfo from "@/api-endpoints/hooks/user/useUser"
import Colors from "@/constants/Colors"
import { useAuth, useUser } from "@clerk/clerk-expo"
import dayjs from "dayjs"
import { Image, ImageStyle } from "expo-image"
import { useRouter } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { capitalize, defaultProfileImage, getCountry } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"
import { notify } from "@/components/notifications/Notifications"

import RightIcon from "../../assets/icons/chevronRight.svg"
import DeleteIcon from "../../assets/icons/delete.svg"
import LockIcon from "../../assets/icons/lock.svg"
import LogoutIcon from "../../assets/icons/logout.svg"
import UserIcon from "../../assets/icons/userCircle.svg"

export default function AccountScreen() {
  const { user } = useUser()
  const router = useRouter()
  const { signOut, sessionId } = useAuth()
  const { styles } = useThemeStyles(componentStyles)

  const { data: userInfo } = useUserInfo()

  const handleLogout = () => {
    if (sessionId) {
      signOut({ sessionId }).then(() => {
        router.replace("/(tabs)/timer")
        notify({ title: "Logout successful!" })
      })
    }
  }

  const handleEditProfile = () => {
    router.push("/(modals)/edit-profile")
  }

  const country = useMemo(
    () =>
      userInfo?.countryCode ? getCountry(userInfo?.countryCode) : undefined,
    [userInfo?.countryCode]
  )

  return (
    <View style={styles.wrapper}>
      <View style={styles.summaryBox}>
        <Image
          style={styles.profilePicture as ImageStyle}
          source={user?.hasImage ? user?.imageUrl : defaultProfileImage}
          contentFit="cover"
          transition={1000}
        />

        <View>
          <Text style={styles.username}>{userInfo?.username}</Text>
          <View style={styles.progress}>
            <Text style={styles.number}>32</Text>
            <Text style={[styles.numberLabel, { marginRight: 8 }]}>h</Text>
            <Text style={styles.number}>44</Text>
            <Text style={styles.numberLabel}>min</Text>
          </View>
          <View style={styles.membershipContainer}>
            <Text style={styles.membershipLabel}>Free member</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16, marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Account details</Text>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Username</Text>
          <Text style={styles.detailData}>{userInfo?.username || "-"}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailData}>{userInfo?.email || "-"}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Age</Text>
          <Text style={styles.detailData}>
            {userInfo?.birthday ? dayjs().diff(userInfo.birthday, "year") : "-"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailData}>
            {userInfo?.gender ? capitalize(userInfo.gender) : "-"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Joined since</Text>
          <Text style={styles.detailData}>
            {userInfo?.createdAt
              ? dayjs(userInfo.createdAt).format("MMMM D, YYYY")
              : "-"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailData}>
            {userInfo?.city ? userInfo?.city : ""}
            {country
              ? `${userInfo?.city ? ", " : ""}${country.name} ${country.flag}`
              : ""}
            {!userInfo?.city && !country && "-"}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16, marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Settings</Text>
      </View>

      <View>
        <AnimatedButton scale={0.99} onPress={handleLogout}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <LogoutIcon color={Colors.gray[700]} style={styles.settingsIcon} />
            <Text style={styles.settingsLabel}>Logout</Text>
            <RightIcon
              color={Colors.gray[700]}
              style={styles.arrowIcon}
              strokeWidth={2.5}
            />
          </View>
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton scale={0.99} onPress={handleEditProfile}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <UserIcon color={Colors.gray[700]} style={styles.settingsIcon} />
            <Text style={styles.settingsLabel}>Edit account info</Text>
            <RightIcon
              color={Colors.gray[700]}
              style={styles.arrowIcon}
              strokeWidth={2.5}
            />
          </View>
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton scale={0.99}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <LockIcon color={Colors.gray[700]} style={styles.settingsIcon} />
            <Text style={styles.settingsLabel}>Change password</Text>
            <RightIcon
              color={Colors.gray[700]}
              style={styles.arrowIcon}
              strokeWidth={2.5}
            />
          </View>
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton scale={0.99}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <DeleteIcon color={Colors.gray[700]} style={styles.settingsIcon} />
            <Text style={styles.settingsLabel}>Delete account</Text>
            <RightIcon
              color={Colors.gray[700]}
              style={styles.arrowIcon}
              strokeWidth={2.5}
            />
          </View>
        </AnimatedButton>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 120,
      paddingHorizontal: 24,
    },
    summaryBox: {
      backgroundColor: Colors.gray[300],
      width: "100%",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      gap: 16,
    },
    profilePicture: {
      height: 100,
      width: 100,
      borderRadius: 100,
    },
    username: {
      fontWeight: "700",
      color: Colors.gray[900],
      fontSize: 18,
      fontFamily: "GabaritoSemibold",
      position: "absolute",
      top: 0,
    },
    // Progress
    progress: {
      flexDirection: "row",
      position: "absolute",
      top: 20,
    },
    number: {
      fontSize: 42,
      fontWeight: "900",
      color: Colors.gray[900],
      marginRight: 2,
    },
    numberLabel: {
      fontSize: 30,
      fontWeight: "900",
      color: Colors.gray[900],
      marginTop: 13,
    },
    // Membership
    membershipContainer: {
      backgroundColor: Colors.gray[400],
      position: "absolute",
      bottom: 0,
      paddingHorizontal: 28,
      paddingVertical: 2,
      borderRadius: 8,
    },
    membershipLabel: {
      color: Colors.gray[900],
      fontWeight: "600",
    },
    // Section titles
    sectionTitle: {
      color: Colors.gray[700],
      fontWeight: "700",
      fontSize: 20,
    },
    // Account details
    detailLabel: {
      width: 130,
      color: Colors.gray[500],
    },
    detailData: {
      color: Colors.gray[700],
      fontWeight: "700",
    },
    // Settings
    settingsIcon: {
      width: 26,
      height: 26,
      marginRight: 12,
    },
    settingsLabel: {
      fontWeight: "700",
      color: Colors.gray[700],
      flex: 1,
    },
    arrowIcon: {
      width: 20,
      height: 20,
      marginTop: 2,
    },
    separator: {
      width: "100%",
      height: 1,
      backgroundColor: Colors.gray[400],
      opacity: 0.6,
      margin: 0,
    },
  })
