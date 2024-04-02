import Colors from "@/constants/Colors"
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import Select from "./Select"
import SelectTimes from "./SelectTimes"

type InputValue = {
  times: number
  period: "DAY" | "WEEK" | "MONTH"
}

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

const PERIOD_OPTIONS = [
  {
    label: "Day",
    value: "DAY",
  },
  {
    label: "Week",
    value: "WEEK",
  },
  {
    label: "Month",
    value: "MONTH",
  },
]

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
            title="Select number of repetitions"
            onChange={val =>
              onChange({ times: val, period: value?.period || "WEEK" })
            }
            value={value.times}
            options={TIMES_OPTIONS}
            wrapperProps={{ style: { flex: 1 } }}
          />

          <Text style={styles.infoLabel}>times per</Text>

          <Select
            placeholder="Select..."
            title="Select period"
            onChange={val =>
              val && onChange({ times: value?.times, period: val as any })
            }
            value={value?.period}
            options={PERIOD_OPTIONS}
            wrapperProps={{
              style: { flex: 1 },
            }}
            valueStyle={{ textAlign: "center" }}
            snapPoints={["30%"]}
            buttonScale={0.97}
            hideClose
          />
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
      color: isDark ? Colors.gray[300] : Colors.gray[900],
    },
    inputValue: {},
  })
