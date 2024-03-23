import { useState } from "react"
import ChevronIcon from "@/assets/icons/chevronDown.svg"
import FilterIcon from "@/assets/icons/filter.svg"
import PlusIcon from "@/assets/icons/plus.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { Image } from "expo-image"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { capitalize, rgbToRGBA } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useItemListConfig from "../ItemList/hooks/useItemListConfig"

export default function GoalsHeader(props: BottomTabHeaderProps) {
  const { styles, isDark } = useThemeStyles(componentStyles)

  return (
    <View
      style={{
        height: 112,
        paddingHorizontal: 24,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
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
                color={isDark ? Colors.gray[400] : Colors.gray[600]}
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
            <AnimatedButton
              style={{
                marginTop: 14,
                padding: 8,
              }}
            >
              <PlusIcon
                color={isDark ? Colors.gray[400] : Colors.gray[600]}
                strokeWidth={2}
                style={{ width: 24, height: 24 }}
              />
            </AnimatedButton>
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
        style={{
          position: "absolute",
          flexDirection: "row",
          paddingHorizontal: 6,
        }}
      >
        <AnimatedButton onPress={() => setIsOpen(prev => !prev)} scale={0.96}>
          <Text style={[styles.title, isOpen && { color: Colors.gray[500] }]}>
            {`${capitalize(itemType)}s`}
          </Text>
        </AnimatedButton>
        <View
          style={{
            display: "flex",
            marginLeft: 4,
          }}
        >
          <ChevronIcon
            color={isDark ? Colors.gray[400] : Colors.gray[400]}
            strokeWidth={2.5}
            style={{
              position: "relative",
              top: 24,
              width: 24,
              height: 24,
            }}
          />
        </View>
      </View>

      {isOpen && (
        <Animated.View
          style={{
            position: "relative",
            width: 160,
            marginTop: 60,
            backgroundColor: rgbToRGBA(Colors.gray[200], 1),
            borderRadius: 12,
            shadowOffset: {
              width: 3,
              height: -3,
            },
            shadowRadius: 10,
            elevation: 10,
            borderWidth: 1,
            borderColor: "#dde1e7",
            zIndex: 100000,
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
                  {
                    fontSize: 30,
                    color: Colors.gray[500],
                    paddingVertical: 6,
                    paddingLeft: 10,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: rgbToRGBA(Colors.gray[400], 0.4),
                  },
                  pressed && {
                    backgroundColor: Colors.gray[300],
                  },
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
                  {
                    fontSize: 30,
                    color: Colors.gray[500],
                    paddingVertical: 6,
                    paddingLeft: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: rgbToRGBA(Colors.gray[400], 0.4),
                  },
                  pressed && {
                    backgroundColor: Colors.gray[300],
                  },
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
                  {
                    fontSize: 30,
                    color: Colors.gray[500],
                    paddingVertical: 6,
                    paddingLeft: 10,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                  pressed && {
                    backgroundColor: Colors.gray[300],
                  },
                ]}
              >
                Dreams
              </Text>
            )}
          </Pressable>
        </Animated.View>
      )}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      fontSize: 46,
      fontFamily: "GabaritoSemibold",
      color: Colors.gray[400],
    },
  })