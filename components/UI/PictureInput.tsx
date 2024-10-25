import React from "react"
import CloseIcon from "@/assets/icons/close.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { defaultProfileImage } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"

export type PictureInputProps = {
  value?: ImagePicker.ImagePickerAsset | string
  onChange: (val?: ImagePicker.ImagePickerAsset | null) => void
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
}

export default function PictureInput(props: PictureInputProps) {
  const { label, wrapperProps, labelProps, value, onChange } = props
  const { styles, isDark } = useThemeStyles(inputStyles)

  const handlePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    })

    if (!result.canceled) onChange(result.assets[0])
  }

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}
      <View style={{ flexDirection: "row", gap: 24 }}>
        <AnimatedButton
          onPress={handlePick}
          scale={0.96}
          style={{ alignSelf: "flex-start" }}
        >
          <Image
            style={styles.picture as any}
            source={(value as ImagePicker.ImagePickerAsset)?.uri || value}
            placeholder={{ blurhash: defaultProfileImage }}
            contentFit="cover"
            transition={200}
          />
        </AnimatedButton>
        {value && (
          <AnimatedButton
            style={styles.removeBtn}
            entering={FadeIn(0.8)}
            exiting={FadeOut(0.8)}
            onPress={() => onChange(null)}
          >
            <CloseIcon
              color={isDark ? Colors.gray[100] : Colors.gray[600]}
              style={styles.closeIcon}
            />
          </AnimatedButton>
        )}
      </View>
    </View>
  )
}

const inputStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    picture: {
      height: 100,
      width: 100,
      borderRadius: 100,
      backgroundColor: "gray",
    },
    label: {
      marginRight: "auto",
      marginLeft: 12,
      marginBottom: 4,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    removeBtn: {
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 100,
      alignSelf: "center",
      padding: 8,
    },
    closeIcon: {
      width: 26,
      height: 26,
    },
    errorlabel: {
      marginTop: 4,
      paddingLeft: 12,
      alignSelf: "flex-start",
    },
    errorText: {
      color: Colors.rose[600],
    },
  })
