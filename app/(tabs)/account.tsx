import Colors from "@/constants/Colors"
import { useUser } from "@clerk/clerk-expo"
import { Image, ImageStyle } from "expo-image"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export default function AccountScreen() {
  const { user } = useUser()
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View style={styles.wrapper}>
      <View style={styles.summaryBox}>
        <Image
          style={styles.profilePicture as ImageStyle}
          source={user?.imageUrl}
          // placeholder={blurhash}
          contentFit="cover"
          transition={1000}
        />

        <View>
          <Text style={styles.username}>{user?.username}</Text>
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
          <Text style={styles.detailData}>kaspis245</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailData}>kaspis245@gmail.com</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Age</Text>
          <Text style={styles.detailData}>27</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailData}>Male</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Joined since</Text>
          <Text style={styles.detailData}>March 11, 2024</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailData}>Vilnius, Lithuania 🇱🇹</Text>
        </View>

        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>
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
  })
