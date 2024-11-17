import { Fragment } from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export default function StepIndicator({
  numSteps,
  activeStep,
}: {
  numSteps: number
  activeStep: number
}) {
  const { styles } = useThemeStyles(componentStyles)
  const stepsArray = Array(numSteps)
    .fill(null)
    .map((_, i) => ++i)

  return (
    <View style={styles.wrapper}>
      {stepsArray.map((num, idx) => (
        <Fragment key={num}>
          <View
            key={idx}
            style={[
              styles.stepWrapper,
              num < activeStep && styles.completedStep,
              activeStep === num && styles.activeStep,
            ]}
          >
            <Text
              style={[
                styles.stepText,
                num < activeStep && styles.completedStepText,
              ]}
            >
              {num}
            </Text>
          </View>
          {idx < stepsArray.length - 1 && (
            <View key={`line_${idx}`} style={styles.stepSeparator} />
          )}
        </Fragment>
      ))}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      width: "100%",
      maxWidth: 300,
      justifyContent: "space-between",
      alignItems: "center",
    },
    stepWrapper: {
      width: 24,
      height: 24,
      backgroundColor: isDark ? Colors.gray[500] : Colors.gray[50],
      borderRadius: 100,
      borderWidth: 1,
      borderColor: isDark ? Colors.gray[500] : Colors.gray[200],
      justifyContent: "center",
      alignItems: "center",
    },
    completedStep: {
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[200],
      borderColor: isDark ? Colors.gray[600] : Colors.gray[200],
    },
    activeStep: {
      borderWidth: 2,
      borderColor: isDark ? Colors.gray[100] : Colors.gray[500],
    },
    stepText: {
      fontWeight: "700",
      color: isDark ? Colors.gray[200] : Colors.gray[700],
    },
    completedStepText: {
      color: isDark ? Colors.gray[400] : Colors.gray[500],
    },
    stepSeparator: {
      height: 1,
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[300],
      flex: 1,
      marginHorizontal: 8,
    },
  })
