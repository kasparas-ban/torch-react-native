import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import TimerBoldIcon from "@/assets/icons/timerBold.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import { Goal } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { formatTimeSpent } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"

export default function EditItemFunction() {
  const { styles } = useThemeStyles(componentStyles)
  const { editItem } = useEditItem()

  return (
    <View style={styles.background}>
      <Text style={styles.itemTitle}>Learn Spanish language</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row", gap: 2, marginRight: 12 }}>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 42,
              textAlignVertical: "bottom",
              color: Colors.rose[500],
            }}
          >
            99
          </Text>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 34,
              textAlignVertical: "bottom",
              marginBottom: 2,
              color: Colors.rose[500],
            }}
          >
            %
          </Text>
        </View>

        <View style={{ justifyContent: "center", gap: 3, flexGrow: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: Colors.gray[500],
                marginRight: 4,
                marginLeft: "auto",
              }}
            >
              Total time spent:
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: Colors.gray[500],
                marginRight: 4,
                marginLeft: "auto",
              }}
            >
              Time left:
            </Text>
          </View>
        </View>

        {editItem && (
          <View
            style={{
              justifyContent: "center",
              gap: 3,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TimerIcon
                color={Colors.gray[500]}
                style={{ width: 16, height: 16 }}
              />
              <Text style={{ color: Colors.gray[500] }}>
                {formatTimeSpent(
                  (editItem as Goal).totalTimeSpent || editItem.timeSpent
                )}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TimerBoldIcon
                color={Colors.gray[500]}
                style={{ width: 18, height: 18 }}
              />
              <Text style={{ color: Colors.gray[500] }}>0 h</Text>
            </View>
          </View>
        )}
      </View>

      <View>
        <AnimatedButton style={styles.timerBtn} scale={0.98}>
          <Text style={styles.timerBtnLabel}>Start timer</Text>
        </AnimatedButton>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    background: {
      backgroundColor: "white",
      width: "auto",
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      minWidth: 280,
    },
    itemTitle: {
      fontWeight: "700",
      color: Colors.gray[600],
      fontSize: 18,
      textAlign: "center",
    },
    timerBtn: {
      marginTop: 6,
      backgroundColor: Colors.rose[500],
      paddingVertical: 8,
      width: "100%",
      borderRadius: 18,
      alignItems: "center",
    },
    timerBtnLabel: {
      fontWeight: "800",
      letterSpacing: 0.8,
      color: "white",
    },
  })
