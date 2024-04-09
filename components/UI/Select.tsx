import { useRef } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { LinearGradient } from "expo-linear-gradient"
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewProps,
} from "react-native"
import { GroupedOption, SelectOption } from "@/types/generalTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import { BottomModal, BottomModalType } from "../SelectModal/BottomModal"
import ToggleGroup from "./ToggleGroup"

export type SelectProps<T> = {
  value?: T
  onChange: (val: T | null) => void
  options: SelectOption<T>[] | GroupedOption<T>[]
  placeholder: string
  label?: string
  title?: string
  snapPoints?: (string | number)[]
  wrapperProps?: ViewProps
  labelProps?: TextProps
  valueStyle?: StyleProp<TextStyle>
  errorProps?: TextProps
  sheetProps?: Partial<BottomModalType>
  hideClose?: boolean
  buttonScale?: number
}

function isGrouped<T>(options: any): options is GroupedOption<T>[] {
  return !!options.length && "options" in options?.[0]
}

export default function Select<T>(props: SelectProps<T>) {
  const {
    placeholder,
    valueStyle,
    value,
    onChange,
    label,
    title,
    labelProps,
    sheetProps,
    wrapperProps,
    options,
    snapPoints,
    hideClose,
    buttonScale,
  } = props
  const { styles, isDark } = useThemeStyles(selectStyles)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  const isGroupedOptions = isGrouped(options)
  const selected = isGroupedOptions
    ? options
        .map(option => option.options)
        .flat()
        .find(option => option.value === value)
    : options.find(option => option.value === value)

  const isOptionsEmpty = !options.length

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}
      <AnimatedButton
        style={styles.input}
        onPress={openSelectModal}
        scale={buttonScale ? buttonScale : 1}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.placeholder,
              pressed && styles.inputActive,
              selected && styles.inputValue,
              valueStyle,
            ]}
          >
            {selected?.label ?? placeholder}
          </Text>
        )}
      </AnimatedButton>

      {!hideClose && selected && (
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
        snapPoints={isOptionsEmpty ? ["20%"] : snapPoints || ["30%"]}
        isVirtualized
      >
        {isGroupedOptions ? (
          <>
            <View
              style={{
                marginBottom: 12,
                position: "absolute",
                left: 24,
                right: 24,
                zIndex: 1,
                backgroundColor: "white",
              }}
            >
              {title && <Text style={styles.title}>{title}</Text>}
              <LinearGradient
                colors={[isDark ? Colors.gray[900] : "white", "transparent"]}
                style={{
                  height: 30,
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 30,
                  zIndex: 2,
                }}
              />
            </View>
            {isOptionsEmpty ? (
              <Text style={styles.noOptionsLabel}>No options</Text>
            ) : (
              <BottomSheetScrollView>
                <View
                  style={{
                    paddingHorizontal: 24,
                    paddingBottom: 40,
                    paddingTop: 40,
                  }}
                >
                  <ScrollView>
                    <GroupedOptions
                      options={options}
                      selectedItem={selected}
                      onSelectItem={val => onChange(val?.value || null)}
                      isDark={isDark}
                    />
                  </ScrollView>
                </View>
              </BottomSheetScrollView>
            )}
          </>
        ) : (
          <View style={{ paddingHorizontal: 24 }}>
            <ToggleGroup
              title={title}
              options={options}
              selected={selected?.value}
              onChange={val => onChange(val)}
              isVirtualized={false}
            />
          </View>
        )}
      </BottomModal>
    </View>
  )
}

function GroupedOptions<T>({
  options,
  selectedItem,
  onSelectItem,
  isDark,
}: {
  options: GroupedOption<T>[]
  selectedItem?: SelectOption<T> | null
  onSelectItem: (option: SelectOption<T> | null) => void
  isDark: boolean
}) {
  return (
    <View style={{ gap: 4 }}>
      {options.map(group => (
        <View key={group.label}>
          <Text
            style={{
              fontWeight: "600",
              color: isDark ? Colors.gray[400] : Colors.gray[500],
              marginBottom: 8,
              marginTop: 10,
              marginLeft: 12,
            }}
          >
            {group.label}
          </Text>
          <View style={{ gap: 4 }}>
            {group.options.map(option => (
              <AnimatedButton
                key={option.value as string}
                style={[
                  {
                    height: 48,
                    backgroundColor: isDark
                      ? Colors.gray[600]
                      : Colors.gray[200],
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                  option.value === selectedItem?.value && {
                    backgroundColor: Colors.rose[400],
                  },
                ]}
                scale={0.99}
                onPress={() => onSelectItem(option)}
              >
                <Text
                  style={[
                    {
                      marginLeft: 12,
                      color: isDark ? Colors.gray[300] : Colors.gray[700],
                    },
                    option.value === selectedItem?.value && {
                      color: Colors.gray[50],
                      fontWeight: "600",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </AnimatedButton>
            ))}
          </View>
        </View>
      ))}
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
