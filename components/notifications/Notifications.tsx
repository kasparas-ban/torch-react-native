import { ReactNode } from "react"
import SuccessIcon from "@/assets/icons/checkCircle.svg"
import AlertIcon from "@/assets/icons/exclamationCircle.svg"
import ErrorIcon from "@/assets/icons/xCircle.svg"
import Colors from "@/constants/Colors"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { Notifier } from "react-native-notifier"

type NotificationType = "SUCCESS" | "ALERT" | "ERROR"

const SingleLineComponent =
  (type: NotificationType) =>
  ({ title }: { title: ReactNode }) => {
    return (
      <SafeAreaView style={{ backgroundColor: getBackgroundColor(type) }}>
        <View
          style={[
            styles.container,
            { paddingBottom: 10, justifyContent: "center" },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
        </View>
      </SafeAreaView>
    )
  }

const MultiLineComponent =
  (type: NotificationType) =>
  ({ title, description }: { title: ReactNode; description: ReactNode }) => {
    return (
      <SafeAreaView style={{ backgroundColor: getBackgroundColor(type) }}>
        <View style={styles.container}>
          <NotificationIcon type={type} />
          <View style={{ marginRight: 40 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  return type === "SUCCESS" ? (
    <SuccessIcon color={Colors.gray[50]} style={styles.icon} />
  ) : type === "ALERT" ? (
    <AlertIcon color={Colors.gray[50]} style={styles.icon} />
  ) : (
    <ErrorIcon color={Colors.gray[50]} style={styles.icon} />
  )
}

const getBackgroundColor = (type: NotificationType) =>
  type === "SUCCESS"
    ? Colors.green[500]
    : type === "ALERT"
      ? Colors.amber[400]
      : Colors.rose[500]

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    paddingRight: 40,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  title: { color: "white", fontWeight: "bold" },
  description: { color: "white" },
  icon: {
    width: 30,
    height: 30,
  },
})

export const notify = ({
  title,
  description,
  type = "SUCCESS",
}: {
  title: string
  description?: string
  type?: NotificationType
}) =>
  Notifier.showNotification({
    title,
    description,
    Component: description
      ? MultiLineComponent(type)
      : SingleLineComponent(type),
  })
