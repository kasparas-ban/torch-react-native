import { useRef } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import {
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import { SelectOption } from "@/types/generalTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import { BottomModal } from "../SelectModal/BottomModal"
import ToggleGroup from "./ToggleGroup"

export type SelectProps<T> = {
  value?: T
  onChange: (val?: T) => void
  options: SelectOption<T>[]
  placeholder: string
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function Select<T>(props: SelectProps<T>) {
  const { placeholder, value, onChange, label, labelProps, options } = props
  const { styles, isDark } = useThemeStyles(selectStyles)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  const selected = options.find(option => option.value === value)

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}
      <Pressable style={styles.input} onPress={openSelectModal}>
        {({ pressed }) => (
          <Text
            style={[
              styles.placeholder,
              pressed && styles.inputActive,
              selected && styles.inputValue,
            ]}
          >
            {selected?.label ?? placeholder}
          </Text>
        )}
      </Pressable>

      {selected && (
        <AnimatedButton
          style={styles.iconWrapper}
          onPress={() => onChange(undefined)}
        >
          <CloseIcon
            color={isDark ? Colors.gray[400] : Colors.gray[600]}
            style={styles.closeIcon}
          />
        </AnimatedButton>
      )}

      <BottomModal
        modalRef={bottomSheetModalRef}
        snapPoints={["30%"]}
        enableDynamicSizing
      >
        <ToggleGroup
          title="Select gender"
          options={options}
          selected={selected?.value}
          onChange={val => onChange(val)}
        />
      </BottomModal>
    </View>
  )
}

const selectStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
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
      color: Colors.gray[500],
    },
    placeholder: {
      paddingHorizontal: 16,
      borderRadius: 12,
      textAlignVertical: "center",
      height: "100%",
      color: Colors.gray[500],
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
  })
