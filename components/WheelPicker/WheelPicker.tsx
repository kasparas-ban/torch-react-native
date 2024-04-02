import React, { useEffect, useMemo, useRef, useState } from "react"
import Colors from "@/constants/Colors"
import {
  Animated,
  Appearance,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { FlatList } from "react-native-gesture-handler"

import styles from "./WheelPicker.styles"
import WheelPickerItem from "./WheelPickerItem"

interface Props {
  selectedIndex: number
  options: string[]
  onChange: (index: number) => void
  selectedIndicatorStyle?: StyleProp<ViewStyle>
  itemTextStyle?: TextStyle
  itemStyle?: ViewStyle
  itemHeight?: number
  containerStyle?: ViewStyle
  containerProps?: Omit<ViewProps, "style">
  scaleFunction?: (x: number) => number
  rotationFunction?: (x: number) => number
  opacityFunction?: (x: number) => number
  visibleRest?: number
  decelerationRate?: "normal" | "fast" | number
  flatListProps?: Omit<FlatListProps<string | null>, "data" | "renderItem">
  isHorizontal?: boolean
}

const GestureFlatList = Animated.createAnimatedComponent(
  FlatList<string | null>
)

const WheelPicker: React.FC<Props> = ({
  selectedIndex,
  options,
  onChange,
  selectedIndicatorStyle = {},
  containerStyle = {},
  itemStyle = {},
  itemTextStyle = {},
  itemHeight = 48,
  scaleFunction = (x: number) => 1.0 ** x,
  rotationFunction = (x: number) => 1 - Math.pow(1 / 2, x),
  opacityFunction = (x: number) => Math.pow(1 / 3, x),
  visibleRest = 2,
  decelerationRate = "fast",
  containerProps = {},
  flatListProps = {},
  isHorizontal = false,
}) => {
  const isDark = Appearance.getColorScheme() === "dark"

  const flatListRef = useRef<FlatList>(null)
  const [scrollY] = useState(new Animated.Value(0))

  const containerHeight = (1 + visibleRest * 2) * itemHeight
  const paddedOptions = useMemo(() => {
    const array: (string | null)[] = [...options]
    for (let i = 0; i < visibleRest; i++) {
      array.unshift(null)
      array.push(null)
    }
    return array
  }, [options, visibleRest])

  const offsets = useMemo(
    () => [...Array(paddedOptions.length)].map((_, i) => i * itemHeight),
    [paddedOptions, itemHeight]
  )

  const currentScrollIndex = useMemo(
    () => Animated.add(Animated.divide(scrollY, itemHeight), visibleRest),
    [visibleRest, scrollY, itemHeight]
  )

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    // Due to list bounciness when scrolling to the start or the end of the list
    // the offset might be negative or over the last item.
    // We therefore clamp the offset to the supported range.
    const offsetY = Math.min(
      itemHeight * (options.length - 1),
      Math.max(
        isHorizontal
          ? event.nativeEvent.contentOffset.x
          : event.nativeEvent.contentOffset.y,
        0
      )
    )

    let index = Math.floor(Math.floor(offsetY) / itemHeight)
    const last = Math.floor(offsetY % itemHeight)
    if (last > itemHeight / 2) index++

    if (index !== selectedIndex) {
      onChange(index)
    }
  }

  useEffect(() => {
    if (selectedIndex < 0 || selectedIndex >= options.length) {
      throw new Error(
        `Selected index ${selectedIndex} is out of bounds [0, ${
          options.length - 1
        }]`
      )
    }
  }, [selectedIndex, options])

  /**
   * If selectedIndex is changed from outside (not via onChange) we need to scroll to the specified index.
   * This ensures that what the user sees as selected in the picker always corresponds to the value state.
   */
  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: false,
    })
  }, [selectedIndex])

  return (
    <View
      style={[
        styles.container,
        {
          ...(isHorizontal
            ? { width: containerHeight, height: 80 }
            : { height: containerHeight }),
        },
        containerStyle,
      ]}
      {...containerProps}
    >
      <View
        style={[
          isHorizontal ? styles.selectedIndicatorHor : styles.selectedIndicator,
          selectedIndicatorStyle,
          isDark && { backgroundColor: Colors.gray[600] },
          {
            transform: [
              {
                ...(isHorizontal
                  ? { translateX: -itemHeight / 2 }
                  : { translateY: -itemHeight / 2 }),
              },
            ],
            ...(isHorizontal ? { width: itemHeight } : { height: itemHeight }),
          },
        ]}
      />
      <GestureFlatList
        {...flatListProps}
        ref={flatListRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  ...(isHorizontal ? { x: scrollY } : { y: scrollY }),
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToOffsets={offsets}
        decelerationRate={decelerationRate}
        initialScrollIndex={selectedIndex}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        data={paddedOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: option, index }) => (
          <WheelPickerItem
            key={`option-${index}`}
            index={index}
            option={option}
            style={itemStyle}
            textStyle={itemTextStyle}
            height={itemHeight}
            currentScrollIndex={currentScrollIndex}
            scaleFunction={scaleFunction}
            rotationFunction={rotationFunction}
            opacityFunction={opacityFunction}
            visibleRest={visibleRest}
            isHorizontal
          />
        )}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={!isHorizontal}
      />
    </View>
  )
}

export default WheelPicker
