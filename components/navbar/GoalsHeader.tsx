import { useEffect, useState } from "react"
import ChevronIcon from "@/assets/icons/chevronDown.svg"
import FilterIcon from "@/assets/icons/filter.svg"
import PlusIcon from "@/assets/icons/plus.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { capitalize, rgbToRGBA } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useItemListConfig from "../ItemList/hooks/useItemListConfig"
import Link from "../UI/Link"

export default function GoalsHeader() {
  const { isDark } = useThemeStyles(componentStyles)

  return (
    <View
      style={{
        height: 112,
        paddingHorizontal: 24,
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
        }}
        pointerEvents="none"
      >
        <Image
          source={require("@/assets/images/header_background.png")}
          style={{
            position: "absolute",
            top: -30,
            right: 0,
            left: 0,
            height: 600,
            maxWidth: 500,
            marginHorizontal: "auto",
          }}
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        <ItemTypeSelector />

        <View style={{ marginLeft: "auto", flexDirection: "row" }}>
          <View
            style={{
              display: "flex",
              marginLeft: "auto",
            }}
          >
            <AnimatedButton
              style={{
                marginTop: 14,
                padding: 8,
              }}
            >
              <FilterIcon
                color={isDark ? Colors.gray[300] : Colors.gray[600]}
                strokeWidth={2}
                style={{ width: 24, height: 24 }}
              />
            </AnimatedButton>
          </View>

          <View
            style={{
              display: "flex",
              marginLeft: 6,
            }}
          >
            <Link
              href="/(modals)/(items)/general-item"
              style={{
                marginTop: 14,
                padding: 8,
              }}
            >
              <PlusIcon
                color={isDark ? Colors.gray[300] : Colors.gray[600]}
                strokeWidth={2}
                style={{ width: 24, height: 24 }}
              />
            </Link>
          </View>
        </View>
      </View>
    </View>
  )
}

function ItemTypeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemType, saveItemType } = useItemListConfig()
  const { styles, isDark } = useThemeStyles(componentStyles)

  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const chevronRotate = useSharedValue(0)

  useEffect(() => {
    chevronRotate.value = withSpring(isOpen ? 1 : 0, {
      duration: 50,
    })
  }, [isOpen])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(chevronRotate.value, [0, 1], [0, 180])}deg`,
        },
        {
          translateY: chevronRotate.value ? 4 : 0,
        },
      ],
    }
  })

  return (
    <View
      style={[
        {
          position: "absolute",
          borderRadius: 12,
          left: -6,
        },
      ]}
    >
      <View
        onLayout={event => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setPosition({ x: x + pageX, y: y + pageY, width, height })
          })
        }}
        style={{
          position: "absolute",
          flexDirection: "row",
          paddingHorizontal: 6,
        }}
      >
        <AnimatedButton onPress={() => setIsOpen(prev => !prev)} scale={0.96}>
          <Text style={[styles.title]}>{`${capitalize(itemType)}s`}</Text>
        </AnimatedButton>
        <View
          style={{
            display: "flex",
            marginLeft: 4,
          }}
        >
          <Animated.View style={[{ top: 24 }, animatedStyle]}>
            <ChevronIcon
              color={isDark ? Colors.gray[300] : Colors.gray[400]}
              strokeWidth={2.5}
              style={{ width: 24, height: 24 }}
            />
          </Animated.View>
        </View>
      </View>

      <Modal visible={isOpen} animationType="fade">
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <BlurView
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            intensity={4}
            experimentalBlurMethod="dimezisBlurView"
          />

          {isOpen && (
            <Animated.View
              style={{
                position: "absolute",
                width: 140,
                top: position.y + 10,
                left: position.x,
                backgroundColor: isDark ? Colors.gray[700] : Colors.gray[200],
                borderRadius: 12,
                shadowOffset: {
                  width: 3,
                  height: -3,
                },
                shadowRadius: 10,
                elevation: 10,
                borderWidth: 1,
                borderColor: isDark ? Colors.gray[600] : "#dde1e7",
              }}
              entering={FadeIn(0.9, 100)}
              exiting={FadeOut(0.9, 100)}
            >
              <Pressable
                onPress={() => {
                  saveItemType("TASK")
                  setIsOpen(false)
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.title,
                      styles.menuOption,
                      {
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: rgbToRGBA(Colors.gray[400], 0.4),
                      },
                      pressed && styles.pressedOption,
                    ]}
                  >
                    Tasks
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  saveItemType("GOAL")
                  setIsOpen(false)
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.title,
                      styles.menuOption,
                      {
                        borderBottomWidth: 1,
                        borderBottomColor: rgbToRGBA(Colors.gray[400], 0.4),
                      },
                      pressed && styles.pressedOption,
                    ]}
                  >
                    Goals
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  saveItemType("DREAM")
                  setIsOpen(false)
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.title,
                      styles.menuOption,
                      {
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      },
                      pressed && styles.pressedOption,
                    ]}
                  >
                    Dreams
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          )}
        </Pressable>
      </Modal>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      fontSize: 46,
      fontFamily: "GabaritoSemibold",
      color: isDark ? Colors.gray[300] : Colors.gray[400],
    },
    menuOption: {
      fontSize: 28,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
      paddingVertical: 6,
      paddingLeft: 10,
    },
    pressedOption: {
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[300],
    },
  })
