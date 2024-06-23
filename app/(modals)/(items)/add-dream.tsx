import { useEffect, useState } from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { formatNewItem } from "@/stores/helpers"
import useItems from "@/stores/itemStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { z } from "zod"
import { SelectOption } from "@/types/generalTypes"
import { Dream } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { pruneObject } from "@/utils/utils"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import InputSelectPanel from "@/components/itemModal/itemForms/InputSelectPanel"
import {
  dreamFormSchema,
  DreamFormType,
} from "@/components/itemModal/itemForms/schemas"
import { notify } from "@/components/notifications/Notifications"
import Button from "@/components/UI/Button"
import DateInput from "@/components/UI/DateInput"
import PriorityInput from "@/components/UI/PriorityInput"
import TextInput from "@/components/UI/TextInput"

type InputType = keyof z.infer<typeof dreamFormSchema>

const inputNames = [
  { label: "Priority", value: "priority" },
  { label: "Target date", value: "target_date" },
] as SelectOption<InputType>[]

const getInitialDreamForm = (initialDream: Dream): DreamFormType => ({
  title: initialDream?.title || "",
  ...(initialDream?.priority && { priority: initialDream?.priority }),
  ...(initialDream?.target_date && { target_date: initialDream?.target_date }),
})

export default function AddDreamModal() {
  const isKeyboardOpen = useKeyboard()
  const { styles } = useThemeStyles(componentStyles)

  const { editItem, setEditItem } = useEditItem()
  const { addItem, updateItem } = useItems()

  const defaultDream = getInitialDreamForm(editItem as Dream)

  const defaultInputOrder = Object.keys(defaultDream).filter(
    key => !!defaultDream[key as InputType]
  ) as InputType[]
  const [inputOrder, setInputOrder] = useState(defaultInputOrder)

  const form = useForm<DreamFormType>({
    resolver: zodResolver(dreamFormSchema),
    defaultValues: defaultDream,
    shouldUnregister: true,
  })

  const onSubmit = (data: DreamFormType) => {
    if (editItem?.item_id) {
      updateItem({ item_id: editItem.item_id, ...data })
    } else {
      const newDream = formatNewItem({ ...data, type: "DREAM" })
      addItem(newDream)
    }

    router.replace("/(tabs)/goals")
    notify({
      title: editItem
        ? "Dream updated successfully"
        : "Dream created successfully",
    })
  }

  useEffect(() => {
    return () => setEditItem(undefined)
  }, [setEditItem])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Text style={styles.title}>
            {editItem ? "Edit Dream" : "New Dream"}
          </Text>
        </View>

        <View style={{ width: "100%", gap: 8 }}>
          <Animated.View key="goal_title" layout={LinearTransition}>
            <Controller
              name="title"
              control={form.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Aa"
                  label="Title"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorProps={{
                    children: form.formState.errors.title?.message,
                  }}
                  wrapperProps={{
                    style: { marginBottom: 12 },
                  }}
                />
              )}
            />
          </Animated.View>

          {inputOrder.map(input => {
            if (input === "priority") {
              return (
                <Animated.View
                  key="dream_priority"
                  entering={FadeIn(0.8)}
                  exiting={FadeOut(0.8)}
                  layout={LinearTransition}
                >
                  <Controller
                    name="priority"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <PriorityInput
                        label="Priority"
                        onChange={onChange}
                        value={value || "MEDIUM"}
                        wrapperProps={{
                          style: { marginBottom: 12 },
                        }}
                      />
                    )}
                  />
                </Animated.View>
              )
            }

            if (input === "target_date") {
              return (
                <Animated.View
                  key="dream_target_date"
                  entering={FadeIn(0.8)}
                  exiting={FadeOut(0.8)}
                  layout={LinearTransition}
                >
                  <Controller
                    name="target_date"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DateInput
                        label="Target date"
                        placeholder="mm/dd/yyyy"
                        onChange={onChange}
                        value={value ? new Date(value) : undefined}
                        minDate={new Date()}
                        wrapperProps={{
                          style: { marginBottom: 12 },
                        }}
                      />
                    )}
                  />
                </Animated.View>
              )
            }
          })}
        </View>

        <Animated.View key="inputs_section" layout={LinearTransition}>
          <InputSelectPanel
            inputNames={inputNames}
            inputOrder={inputOrder}
            setInputOrder={setInputOrder}
            wrapperStyles={{ marginTop: 20 }}
          />
        </Animated.View>
      </View>

      {!isKeyboardOpen && (
        <View
          style={{
            position: "absolute",
            bottom: 28,
            width: "100%",
            paddingHorizontal: 24,
          }}
        >
          <Button scale={0.98} onPress={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </View>
      )}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: "center",
    },
    container: {
      flex: 1,
      marginTop: 50,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 24,
      maxWidth: 400,
      width: "100%",
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[400],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
      width: "100%",
      textAlign: "center",
    },
  })
