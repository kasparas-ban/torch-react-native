import { useRef } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import { BottomModal } from "../SelectModal/BottomModal"
import ToggleGroup from "../UI/ToggleGroup"

export type SelectProps<T> = {
  value?: T
  onChange: (val: string | null) => void
}

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
]

export default function SelectGender<T>(props: SelectProps<T>) {
  const { value, onChange } = props
  const { styles, isDark } = useThemeStyles(selectStyles)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => {
    bottomSheetModalRef.current?.present()
  }

  const selected = GENDER_OPTIONS.find(option => option.value === value)

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Gender</Text>
      <AnimatedButton style={styles.input} onPress={openSelectModal} scale={1}>
        {({ pressed }) => (
          <Text
            style={[
              styles.placeholder,
              pressed && styles.inputActive,
              selected && styles.inputValue,
            ]}
          >
            {selected?.label ?? "Select gender"}
          </Text>
        )}
      </AnimatedButton>

      {selected && (
        <AnimatedButton
          style={styles.iconWrapper}
          onPress={() => onChange(null)}
        >
          <CloseIcon
            color={isDark ? Colors.gray[400] : Colors.gray[600]}
            style={styles.closeIcon}
          />
        </AnimatedButton>
      )}

      <BottomModal modalRef={bottomSheetModalRef} snapPoints={["25%", "25%"]}>
        <BottomSheetView style={{ paddingHorizontal: 24, height: 300 }}>
          <ToggleGroup
            title="Select gender"
            options={GENDER_OPTIONS}
            selected={selected?.value}
            onChange={val => onChange(val)}
            isVirtualized={false}
          />
        </BottomSheetView>
      </BottomModal>
    </View>
  )
}

const selectStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
      marginBottom: 12,
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[600],
      fontSize: 20,
      height: 32,
      fontWeight: "700",
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
    },
    label: {
      marginLeft: 12,
      marginBottom: 4,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    placeholder: {
      paddingHorizontal: 16,
      borderRadius: 12,
      textAlignVertical: "center",
      height: "100%",
      color: isDark ? Colors.gray[400] : Colors.gray[500],
    },
    iconWrapper: {
      position: "absolute",
      marginTop: 23,
      borderBottomEndRadius: 14,
      borderTopEndRadius: 14,
      right: 0,
      height: 48,
      width: 42,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      width: 20,
      height: 20,
    },
    noOptionsLabel: {
      flex: 1,
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 16,
      fontStyle: "italic",
      color: Colors.gray[500],
    },
  })
