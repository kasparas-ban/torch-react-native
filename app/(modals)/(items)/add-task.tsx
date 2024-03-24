import { useState } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { useUpsertItem } from "@/api-endpoints/hooks/items/useUpsertItem"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { Goal, Task } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { pruneObject } from "@/utils/utils"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import {
  taskFormSchema,
  TaskFormType,
} from "@/components/itemModal/itemForms/schemas"
import DurationInput from "@/components/UI/DurationInput"
import PriorityInput from "@/components/UI/PriorityInput"
import TextInput from "@/components/UI/TextInput"

type InputType = keyof z.infer<typeof taskFormSchema>

const getInitialTaskForm = (
  initialTask?: Task,
  parentItem?: Goal
): TaskFormType => ({
  title: initialTask?.title || "",
  duration: initialTask?.duration || 30 * 60,
  priority: initialTask?.priority,
  targetDate: initialTask?.targetDate,
  recurring: initialTask?.recurring,
  goal: parentItem
    ? { label: parentItem.title, value: parentItem.itemID }
    : initialTask?.goal
      ? { label: initialTask.goal.title, value: initialTask.goal.itemID }
      : undefined,
})

export default function AddTaskModal() {
  const { styles } = useThemeStyles(componentStyles)

  const { goals } = useItemsList()
  const { editItem } = useEditItem()
  // const { closeModal, parentItem } = useItemModal()
  const parentItem = undefined

  const { mutateAsync, reset, isPending, isError, isSuccess } =
    useUpsertItem("TASK")

  const defaultTask = getInitialTaskForm(
    parentItem ? undefined : (editItem as Task),
    parentItem as Goal | undefined
  )

  const defaultInputOrder = Object.keys(defaultTask).filter(
    key => !!defaultTask[key as InputType]
  ) as InputType[]
  const [inputOrder, setInputOrder] = useState(defaultInputOrder)

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultTask,
    shouldUnregister: true,
  })

  const onSubmit = (data: TaskFormType) => {
    const { goal, ...rest } = data
    const newTask = {
      ...pruneObject(rest),
      ...(editItem && !parentItem ? { itemID: editItem.itemID } : {}),
      ...(goal ? { parentID: goal.value } : {}),
    }

    mutateAsync(newTask)
      .then(() => {
        setTimeout(() => {
          router.replace("/(tabs)/goals")
        }, 2000)
      })
      .catch(() => {
        // setTimeout(
        //   () =>
        //     toast({
        //       title: "Failed to save",
        //       description:
        //         "Your task has not been saved. Please try adding it again later.",
        //     }),
        //   100
        // )
        setTimeout(() => reset(), 2500)
      })
  }

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
          <Text style={styles.title}>New Task</Text>
        </View>

        <View style={{ width: "100%", gap: 8 }}>
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
                errorProps={{ children: form.formState.errors.title?.message }}
                wrapperProps={{
                  style: { marginBottom: 12 },
                }}
              />
            )}
          />

          <Controller
            name="duration"
            control={form.control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DurationInput
                placeholder="1h 30 min"
                label="Duration"
                onChange={onChange}
                value={value}
                errorProps={{
                  children: form.formState.errors.duration?.message,
                }}
                wrapperProps={{
                  style: { marginBottom: 12 },
                }}
              />
            )}
          />

          <Controller
            name="priority"
            control={form.control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <PriorityInput
                label="Priority"
                onChange={onChange}
                value={value}
                errorProps={{
                  children: form.formState.errors.priority?.message,
                }}
                wrapperProps={{
                  style: { marginBottom: 12 },
                }}
              />
            )}
          />
        </View>
      </View>
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
