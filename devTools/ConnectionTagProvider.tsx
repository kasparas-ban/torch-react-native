import { ReactNode } from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text } from "react-native"
import { AnimatedButton } from "@/components/AnimatedButton"

import useDev from "./useDev"

export default function ConnectionTagProvider({
  children,
}: {
  children: ReactNode
}) {
  const { isOnline, setOnline } = useDev()

  if (!__DEV__) return children

  return (
    <>
      {children}

      <AnimatedButton
        style={[
          tagStyles.tag,
          isOnline ? tagStyles.tagOnline : tagStyles.tagOffline,
        ]}
        onPress={() => setOnline(!isOnline)}
      >
        <Text style={tagStyles.text}>{isOnline ? "Online" : "Offline"}</Text>
      </AnimatedButton>
    </>
  )
}

const tagStyles = StyleSheet.create({
  tag: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    position: "absolute",
    bottom: 100,
    right: 30,
    borderWidth: 2,
  },
  tagOnline: {
    backgroundColor: Colors.green[400],
    borderColor: Colors.green[300],
  },
  tagOffline: {
    backgroundColor: Colors.rose[400],
    borderColor: Colors.rose[300],
  },
  text: {
    fontSize: 16,
    color: Colors.gray[600],
    fontWeight: "600",
    letterSpacing: 1,
  },
})
