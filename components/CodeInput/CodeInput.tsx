import React from "react"
import { Animated, SafeAreaView } from "react-native"
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field"

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_COUNT,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "./styles"

const { Value, Text: AnimatedText } = Animated

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0))
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1))
const animateCell = ({
  hasValue,
  index,
  isFocused,
}: {
  hasValue: boolean
  index: number
  isFocused: boolean
}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
    }),
  ]).start()
}

export default function CodeInput({
  code,
  setCode,
}: {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
}) {
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const hasValue = Boolean(symbol)
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    }

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused })
    }, 0)

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </SafeAreaView>
  )
}
