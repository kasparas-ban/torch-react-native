import Colors from "@/constants/Colors"
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import { taskFormSchema } from "../itemModal/itemForms/schemas"
import SelectTimes from "./SelectTimes"

type InputValue = z.infer<typeof taskFormSchema>["recurring"]

type InputProps = {
  label: string
  value: InputValue
  onChange: (val: InputValue) => void
  wrapperProps: ViewProps
  labelProps?: TextProps
}

const TIMES_OPTIONS = Array.from({ length: 99 }).map((_, index) => ({
  label: (index + 1).toString(),
  value: index + 1,
}))

export default function RecurringInput(props: InputProps) {
  const { label, value, onChange, wrapperProps, labelProps } = props
  const { styles } = useThemeStyles(componentStyles)

  return (
    <>
      <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
        {label && (
          <Text
            {...labelProps}
            children={label}
            style={[styles.label, labelProps?.style]}
          />
        )}

        <View style={styles.inputsWrapper}>
          <SelectTimes
            placeholder="1"
            title="Select recurring times"
            onChange={val =>
              onChange({ times: val, period: value?.period || "WEEK" })
            }
            value={value ? value.times + 1 : 1}
            options={TIMES_OPTIONS}
            wrapperProps={{
              style: { flex: 1 },
            }}
          />

          <Text style={styles.infoLabel}>times per</Text>

          <AnimatedButton
            style={styles.periodBtn}
            scale={0.96}
            //   onPress={() => onChange("LOW")}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.inputValue,
                  // pressed && styles.inputActive,
                  // value === "LOW" && styles.inputSelected,
                ]}
              >
                Week
              </Text>
            )}
          </AnimatedButton>
        </View>
      </View>
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      flexDirection: "row",
      marginLeft: 12,
      marginBottom: 4,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    inputsWrapper: {
      flexDirection: "row",
      width: "100%",
      display: "flex",
      gap: 12,
    },
    durationBtn: {
      height: 48,
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    periodBtn: {
      height: 48,
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
      padding: 4,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    infoLabel: {
      textAlignVertical: "center",
    },
    inputValue: {},
  })
