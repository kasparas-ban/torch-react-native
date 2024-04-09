import { useMemo, useRef, useState } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import COUNTRIES from "@/data/countries.json"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { LinearGradient } from "expo-linear-gradient"
import {
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "./AnimatedButton"
import { BottomModal, BottomModalType } from "./SelectModal/BottomModal"
import TextInput from "./UI/TextInput"
import ToggleGroup from "./UI/ToggleGroup"

export type SelectProps = {
  value: string | null
  onChange: (val: string | null) => void
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
  sheetProps?: BottomModalType
}

export default function SelectCountry(props: SelectProps) {
  const { value, onChange, label, labelProps, sheetProps, wrapperProps } = props
  const { styles, isDark } = useThemeStyles(selectStyles)

  const [searchText, setSearchText] = useState("")

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  const options = useMemo(
    () =>
      COUNTRIES.map(country => ({
        label: country.name,
        value: country.code,
        icon: country.flag,
      })),
    [COUNTRIES]
  )

  const selected = options.find(option => option.value === value)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  )

  const containerHeight = filteredOptions.length * (44 + 4) + 148

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
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
            {selected?.icon ? `${selected?.icon}   ` : null}
            {selected?.label ?? "Select"}
          </Text>
        )}
      </Pressable>

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

      <BottomModal
        modalRef={bottomSheetModalRef}
        {...sheetProps}
        snapPoints={["90%"]}
        onChange={idx => idx === -1 && setSearchText("")}
        isVirtualized
      >
        <View
          style={{
            marginBottom: 12,
            position: "absolute",
            left: 24,
            right: 24,
            zIndex: 1,
          }}
        >
          <View
            style={{ backgroundColor: isDark ? Colors.gray[900] : "white" }}
          >
            <Text style={styles.title}>Select country</Text>
            <TextInput
              style={{ height: 48 }}
              placeholder="Search"
              onChangeText={val => setSearchText(val)}
              value={searchText}
              wrapperProps={{
                style: { marginBottom: 8 },
              }}
            />
          </View>
          <LinearGradient
            colors={[isDark ? Colors.gray[900] : "white", "transparent"]}
            style={{
              height: 30,
              position: "absolute",
              right: 0,
              left: 0,
              top: 98,
            }}
          />
        </View>

        <ToggleGroup
          options={filteredOptions}
          selected={selected?.value}
          onChange={val => onChange(val)}
          containerStyle={{
            flex: 1,
            minHeight: containerHeight,
            marginTop: 124,
          }}
          iconParam="flag"
          isVirtualized
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
    title: {
      color: isDark ? Colors.gray[400] : Colors.gray[600],
      height: 32,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 10,
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
  })
