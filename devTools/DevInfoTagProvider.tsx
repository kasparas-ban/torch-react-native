import { ReactNode, useState } from "react"
import Colors from "@/constants/Colors"
import useWs from "@/stores/websocketStore"
import { useNetInfo } from "@react-native-community/netinfo"
import { StyleSheet, Text, View } from "react-native"
import { HOST } from "@/api/utils/apiConfig"
import { AnimatedButton } from "@/components/AnimatedButton"

import useDev from "./useDev"

export default function DevInfoTagProvider({
  children,
}: {
  children: ReactNode
}) {
  //   if (!__DEV__) return children
  const [showInfo, setShowInfo] = useState(true)
  const { ws, setWs } = useWs()
  const { isOnline } = useDev()
  const { isConnected } = useNetInfo()

  return (
    <>
      {children}

      {showInfo && (
        <View style={[tagStyles.infoContainer, { bottom: 235 }]}>
          <AnimatedButton onPress={() => setWs(undefined)}>
            <Text>Disconnect WS</Text>
          </AnimatedButton>
        </View>
      )}

      {showInfo && (
        <View style={[tagStyles.infoContainer, { bottom: 140 }]}>
          <Text>{`Host: ${HOST}`}</Text>
          <Text>{`WS: ${ws ? "Active" : "-"}`}</Text>
          <Text>{`Online: ${isOnline ? "True" : "False"}`}</Text>
          <Text>{`Is connected: ${isConnected ? "True" : "False"}`}</Text>
        </View>
      )}

      <AnimatedButton
        style={tagStyles.tag}
        onPress={() => setShowInfo(prev => !prev)}
      >
        <Text style={tagStyles.text}>Dev Info</Text>
      </AnimatedButton>
    </>
  )
}

const tagStyles = StyleSheet.create({
  tag: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 100,
    left: 30,
    borderWidth: 1,
    backgroundColor: "white",
  },
  infoContainer: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    position: "absolute",
    bottom: 100,
    left: 30,
    borderWidth: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    color: Colors.gray[600],
    fontWeight: "600",
    letterSpacing: 1,
  },
})
