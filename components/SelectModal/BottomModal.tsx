import React, { ReactNode } from "react"
import Colors from "@/constants/Colors"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { StyleSheet } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export type BottomModalType = {
  modalRef: React.RefObject<BottomSheetModalMethods>
  snapPoints: (string | number)[]
  enableDynamicSizing?: boolean
  enableOverDrag?: boolean
  onChange?: (index: number) => void
  children: ReactNode
  isVirtualized?: boolean
}

export function BottomModal({
  modalRef,
  snapPoints,
  enableDynamicSizing,
  enableOverDrag,
  onChange,
  children,
  isVirtualized,
}: BottomModalType) {
  const { styles } = useThemeStyles(groupStyles)

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={onChange}
      enableDynamicSizing={enableDynamicSizing}
      enableOverDrag={enableOverDrag || false}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheet}
    >
      {isVirtualized ? children : <BottomSheetView>{children}</BottomSheetView>}
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
