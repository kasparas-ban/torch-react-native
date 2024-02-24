import Colors from "@/constants/Colors"
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { Text, View } from "@/components/Themed"

export default function WorldScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}
      >
        Coming Soon
      </Text>
      <View
        style={[
          styles.separator,
          isDark ? styles.separatorDark : styles.separatorLight,
        ]}
      />
      <Text
        style={[
          styles.paragraph,
          isDark ? styles.paragraphDark : styles.paragraphLight,
        ]}
      >
        Sign up now and you'll be the first to know when it goes live!
      </Text>
      <ImageBackground
        source={require("@/assets/images/gradient_animation.gif")}
        style={{
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "black",
            position: "absolute",
            opacity: isDark ? 0.2 : 0,
          }}
        />
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 42,
    fontFamily: "GabaritoBold",
    textTransform: "uppercase",
  },
  titleLight: {
    color: Colors.gray[700],
  },
  titleDark: {
    color: Colors.gray[50],
  },
  paragraph: {
    fontSize: 16,
    maxWidth: 280,
    textAlign: "center",
    marginBottom: 32,
  },
  paragraphLight: {
    color: Colors.gray[600],
  },
  paragraphDark: {
    color: Colors.gray[300],
  },
  separator: {
    marginVertical: 12,
    height: 1,
    width: 200,
    backgroundColor: Colors.gray[400],
  },
  separatorLight: {
    backgroundColor: Colors.gray[400],
  },
  separatorDark: {
    backgroundColor: Colors.gray[400],
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  buttonText: {
    fontWeight: "900",
    fontSize: 20,
    color: Colors.gray[50],
  },
})
