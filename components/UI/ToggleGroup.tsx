import { memo, useCallback } from "react"
import Colors from "@/constants/Colors"
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { AnimatedStyle } from "react-native-reanimated"
import { SelectOption } from "@/types/generalTypes"
import useThemeStyles, {
  NamedStyles,
  ThemeStylesProps,
} from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

type ListItemProps<T> = {
  item: SelectOption<T>
  styles: NamedStyles<any>
  onPress: (item: SelectOption<T>) => void
  isSelected: boolean
}

export default function ToggleGroup<T>({
  title,
  options,
  selected,
  onChange,
  containerStyle,
  isVirtualized = false,
}: {
  title?: string
  options: SelectOption<T>[]
  selected?: T
  onChange: (val: T) => void
  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
  isVirtualized: boolean
}) {
  const { styles } = useThemeStyles(groupStyles)

  const handlePress = useCallback((item: SelectOption<T>) => {
    onChange(item.value)
  }, [])

  return (
    <View style={styles.wrapper}>
      {title && <Text style={styles.title}>{title}</Text>}
      {isVirtualized ? (
        <BottomSheetVirtualizedList
          data={options}
          keyExtractor={(item: SelectOption<T>) => item.value as any}
          getItemCount={data => data.length}
          getItem={(data, index) => data[index]}
          renderItem={({ item }) => (
            <ListItemMemo
              item={item}
              styles={styles}
              onPress={handlePress}
              isSelected={selected === item.value}
            />
          )}
          contentContainerStyle={containerStyle}
        />
      ) : (
        <>
          {options.map((option, idx) => (
            <AnimatedButton
              key={idx}
              style={[
                styles.optionWrapper,
                selected === option.value && styles.activeOption,
              ]}
              onPress={() => onChange(option.value)}
              scale={0.99}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selected === option.value && styles.activeLabel,
                ]}
              >
                {option.label}
              </Text>
            </AnimatedButton>
          ))}
        </>
      )}
    </View>
  )
}

function ListItem<T>({ item, styles, onPress, isSelected }: ListItemProps<T>) {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
      <AnimatedButton
        style={[styles.optionWrapper, isSelected && styles.activeOption]}
        onPress={() => onPress(item)}
        scale={0.99}
      >
        <Text style={[styles.optionLabel, isSelected && styles.activeLabel]}>
          {item.label}
        </Text>
      </AnimatedButton>
    </View>
  )
}

const ListItemMemo = memo((props: any) => ListItem(props))

const groupStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      gap: 6,
    },
    title: {
      color: isDark ? Colors.gray[400] : Colors.gray[600],
      height: 32,
      fontSize: 20,
      fontWeight: "700",
    },
    optionWrapper: {
      height: 44,
      width: "100%",
      backgroundColor: isDark ? Colors.gray[700] : Colors.gray[100],
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
    },
    optionLabel: {
      marginLeft: 20,
      color: isDark ? Colors.gray[400] : Colors.gray[700],
      fontWeight: "500",
    },
    activeOption: {
      backgroundColor: isDark ? Colors.rose[500] : Colors.rose[400],
      borderWidth: 1,
      borderColor: isDark ? Colors.rose[500] : Colors.rose[300],
    },
    activeLabel: {
      color: Colors.gray[50],
    },
  })
