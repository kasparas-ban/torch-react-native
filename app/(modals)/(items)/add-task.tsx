import { useEffect, useState } from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { formatNewItem } from "@/stores/helpers"
import useItems from "@/stores/itemStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { router, useLocalSearchParams } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { z } from "zod"
import { SelectOption } from "@/types/generalTypes"
import { Task } from "@/types/itemTypes"
import { groupItemsByParent } from "@/api/utils/helpers"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import InputSelectPanel from "@/components/itemModal/itemForms/InputSelectPanel"
import {
  taskFormSchema,
  TaskFormType,
} from "@/components/itemModal/itemForms/schemas"
import { notify } from "@/components/notifications/Notifications"
import Button from "@/components/UI/Button"
import DateInput from "@/components/UI/DateInput"
import DurationInput from "@/components/UI/DurationInput"
import PriorityInput from "@/components/UI/PriorityInput"
import RecurringInput from "@/components/UI/RecuringInput"
import Select from "@/components/UI/Select"
import TextInput from "@/components/UI/TextInput"

type InputType = keyof z.infer<typeof taskFormSchema>

const inputNames = [
  { label: "Priority", value: "priority" },
  { label: "Target date", value: "target_date" },
  { label: "Assign goal", value: "goal" },
  { label: "Repeating", value: "recurring" },
] as SelectOption<InputType>[]

const getInitialTaskForm = (
  initialTask?: Task,
  parent_id?: string
): TaskFormType => ({
  title: initialTask?.title || "",
  duration: initialTask?.duration || 30 * 60,
  priority: initialTask?.priority,
  target_date: initialTask?.target_date,
  recurring: initialTask?.rec_times
    ? {
        times: initialTask?.rec_times || 0,
        period: initialTask?.rec_period || "WEEK",
      }
    : undefined,
  goal: parent_id
    ? parent_id
    : initialTask?.goal
      ? initialTask.goal.item_id
      : undefined,
})

export default function AddTaskModal() {
  const isKeyboardOpen = useKeyboard()
  const { styles } = useThemeStyles(componentStyles)

  const { goals, addItem, updateItem } = useItems()
  const { editItem, setEditItem } = useEditItem()

  const params = useLocalSearchParams()
  const parent_id = params.parent_id as string
  const defaultTask = getInitialTaskForm(
    parent_id ? undefined : (editItem as Task),
    parent_id
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
    const { goal, recurring, ...rest } = data
    const task = {
      ...rest,
      rec_times: recurring?.times,
      rec_period: recurring?.period,
      parent_id: goal || undefined,
    }

    if (editItem?.item_id) {
      const updatedTask = {
        item_id: editItem.item_id,
        ...task,
      }
      updateItem(updatedTask)
    } else {
      const newTask = formatNewItem({ ...task, type: "TASK" })
      addItem(newTask)
    }

    router.replace("/(tabs)/goals")
    notify({
      title: editItem
        ? "Task updated successfully"
        : "Task created successfully",
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
            {editItem ? "Edit Task" : "New Task"}
          </Text>
        </View>

        <View style={{ width: "100%", gap: 8 }}>
          <Animated.View key="task_title" layout={LinearTransition}>
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

          <Animated.View key="task_duration" layout={LinearTransition}>
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
          </Animated.View>

          {inputOrder.map(input => {
            if (input === "goal") {
              const groupedGoals = groupItemsByParent(goals || [], "GOAL")
              const goalOptions = Object.keys(groupedGoals).map(dreamId => ({
                label: groupedGoals[dreamId].parentLabel || "Other",
                options: groupedGoals[dreamId].items.map(goal => ({
                  label: goal.title,
                  value: goal.item_id,
                })),
              }))

              return (
                <Animated.View
                  key="task_goal"
                  entering={FadeIn(0.8)}
                  exiting={FadeOut(0.8)}
                  layout={LinearTransition}
                >
                  <Controller
                    name="goal"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        placeholder="Select..."
                        label="Goal"
                        title="Select goal"
                        onChange={onChange}
                        value={value ?? undefined}
                        options={goalOptions}
                        wrapperProps={{
                          style: { marginBottom: 12 },
                        }}
                        snapPoints={["90%"]}
                      />
                    )}
                  />
                </Animated.View>
              )
            }

            if (input === "priority") {
              return (
                <Animated.View
                  key="task_priority"
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
                  key="task_target_date"
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

            if (input === "recurring") {
              return (
                <Animated.View
                  key="task_recurring"
                  entering={FadeIn(0.8)}
                  exiting={FadeOut(0.8)}
                  layout={LinearTransition}
                >
                  <Controller
                    name="recurring"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <RecurringInput
                        label="Repeating"
                        value={value || { times: 1, period: "WEEK" }}
                        onChange={onChange}
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
