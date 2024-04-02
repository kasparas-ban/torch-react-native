import { useRef } from "react"
import Colors from "@/constants/Colors"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native"
import { NativeViewGestureHandler } from "react-native-gesture-handler"
import { SelectOption } from "@/types/generalTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import { BottomModal, BottomModalType } from "../SelectModal/BottomModal"
import WheelPicker from "../WheelPicker"

export type SelectProps = {
  value: number
  onChange: (val: number) => void
  options: SelectOption<number>[]
  title?: string
  snapPoints?: (string | number)[]
  wrapperProps?: ViewProps
  errorProps?: TextProps
  sheetProps?: Partial<BottomModalType>
}

export default function SelectTimes(props: SelectProps) {
  const { value, onChange, sheetProps, wrapperProps, options, snapPoints } =
    props
  const { styles } = useThemeStyles(selectStyles)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      <AnimatedButton
        style={styles.input}
        onPress={openSelectModal}
        scale={0.97}
      >
        {({ pressed }) => (
          <Text style={[styles.inputValue, pressed && styles.inputActive]}>
            {value}
          </Text>
        )}
      </AnimatedButton>

      <BottomModal
        modalRef={bottomSheetModalRef}
        {...sheetProps}
        snapPoints={snapPoints || ["20%"]}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
            <Text style={styles.title}>Select repeat count</Text>

            <WheelPicker
              selectedIndex={value - 1}
              options={options.map(o => o.label)}
              onChange={index => onChange(index + 1)}
              visibleRest={20}
              itemTextStyle={{ fontSize: 20 }}
              isHorizontal
            />
          </View>
        </NativeViewGestureHandler>
      </BottomModal>
    </View>
  )
}

const selectStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[600],
      fontSize: 20,
      height: 32,
      fontWeight: "700",
      textAlign: "left",
      width: "100%",
      marginBottom: 12,
    },
    input: {
      position: "relative",
      display: "flex",
      height: 48,
      width: "100%",
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
    },
    inputActive: {
      borderWidth: 2,
      borderColor: isDark ? Colors.gray[300] : Colors.gray[700],
    },
    inputValue: {
      color: isDark ? "white" : "black",
      textAlign: "center",
      textAlignVertical: "center",
      height: "100%",
      borderRadius: 12,
    },
  })
