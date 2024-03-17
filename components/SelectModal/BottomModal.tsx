import React, { ReactNode, useMemo } from "react"
import Colors from "@/constants/Colors"
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { StyleSheet } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

type BackdropProps = BottomSheetBackdropProps & {
  onPress?: () => void
  isDark?: boolean
}

export function CustomBackdrop({
  animatedIndex,
  style,
  onPress,
  isDark,
}: BackdropProps) {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 0.6],
      [0, 0.6],
      Extrapolation.CLAMP
    ),
  }))

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: isDark ? Colors.gray[800] : Colors.gray[500],
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  )

  return <Animated.View style={containerStyle} onTouchStart={onPress} />
}

export function BottomModal({
  modalRef,
  snapPoints,
  enableDynamicSizing,
  onChange,
  children,
}: {
  modalRef: React.RefObject<BottomSheetModalMethods>
  snapPoints: (string | number)[]
  enableDynamicSizing?: boolean
  onChange?: (index: number) => void
  children: ReactNode
}) {
  const { styles, isDark } = useThemeStyles(groupStyles)

  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={onChange}
      enableDynamicSizing={enableDynamicSizing}
      backdropComponent={props =>
        CustomBackdrop({
          ...props,
          onPress: () => modalRef.current?.close(),
          isDark,
        })
      }
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheet}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  )
}

const groupStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    sheet: {
      backgroundColor: isDark ? Colors.gray[900] : "white",
    },
    handle: {
      backgroundColor: isDark ? Colors.gray[400] : Colors.gray[800],
    },
  })
