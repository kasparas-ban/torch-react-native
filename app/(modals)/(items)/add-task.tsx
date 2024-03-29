import { useState } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { useUpsertItem } from "@/api-endpoints/hooks/items/useUpsertItem"
import { groupItemsByParent } from "@/api-endpoints/utils/helpers"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { z } from "zod"
import { SelectOption } from "@/types/generalTypes"
import { Goal, Task } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { pruneObject } from "@/utils/utils"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import InputSelectPanel from "@/components/itemModal/itemForms/InputSelectPanel"
import {
  taskFormSchema,
  TaskFormType,
} from "@/components/itemModal/itemForms/schemas"
import Button from "@/components/UI/Button"
import DateInput from "@/components/UI/DateInput"
import DurationInput from "@/components/UI/DurationInput"
import PriorityInput from "@/components/UI/PriorityInput"
import Select from "@/components/UI/Select"
import TextInput from "@/components/UI/TextInput"

const GOALS_MOCK = [
  {
    label: "Other",
    options: [
      {
        label: "Make a todo/timer app",
        value: "4bax1usfu2uk",
      },
      {
        label: "Learn chess",
        value: "5bax1usfu2uk",
      },
      {
        label: 'Read "Demons" by Dostoevsky',
        value: "13ax1usfu2uk",
      },
      {
        label: 'Read "The Shape of Space"',
        value: "14ax1usfu2uk",
      },
    ],
  },
  {
    label: "Learn Spanish",
    options: [
      {
        label: "Learn Spanish vocabulary",
        value: "6bax1usfu2uk",
      },
      {
        label: "Learn Spanish grammar",
        value: "7bax1usfu2uk",
      },
      {
        label: "Spanish language comprehension",
        value: "8bax1usfu2uk",
      },
      {
        label: "Spanish writing",
        value: "9bax1usfu2uk",
      },
    ],
  },
  {
    label: "Learn Spanish111",
    options: [
      {
        label: "Learn Spanish vocabulary",
        value: "6bax1usfu2u1",
      },
      {
        label: "Learn Spanish grammar",
        value: "7bax1usfu2u1",
      },
      {
        label: "Spanish language comprehension",
        value: "8bax1usfu2u1",
      },
      {
        label: "Spanish writing",
        value: "9bax1usfu2u1",
      },
    ],
  },
  {
    label: "Learn Spanish222",
    options: [
      {
        label: "Learn Spanish vocabulary",
        value: "6bax1usfu2u2",
      },
      {
        label: "Learn Spanish grammar",
        value: "7bax1usfu2u2",
      },
      {
        label: "Spanish language comprehension",
        value: "8bax1usfu2u2",
      },
      {
        label: "Spanish writing",
        value: "9bax1usfu2u2",
      },
    ],
  },
  {
    label: "Get fit",
    options: [
      {
        label: "Build muscle",
        value: "10ax1usfu2uk",
      },
    ],
  },
  {
    label: "Get good at math",
    options: [
      {
        label: "Learn Linear Algebra",
        value: "11ax1usfu2uk",
      },
      {
        label: "Learn Calculus",
        value: "12ax1usfu2uk",
      },
    ],
  },
]

type InputType = keyof z.infer<typeof taskFormSchema>

const inputNames = [
  { label: "Priority", value: "priority" },
  { label: "Target date", value: "targetDate" },
  { label: "Assign goal", value: "goal" },
] as SelectOption<InputType>[]

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
  const isKeyboardOpen = useKeyboard()
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

    console.log("New Task", newTask)

    // mutateAsync(newTask)
    //   .then(() => {
    //     setTimeout(() => {
    //       router.replace("/(tabs)/goals")
    //     }, 2000)
    //   })
    //   .catch(() => {
    //     setTimeout(
    //       () =>
    //         toast({
    //           title: "Failed to save",
    //           description:
    //             "Your task has not been saved. Please try adding it again later.",
    //         }),
    //       100
    //     )
    //     setTimeout(() => reset(), 2500)
    //   })
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
                  value: goal.itemID,
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

            if (input === "targetDate") {
              return (
                <Animated.View
                  key="task_targetDate"
                  entering={FadeIn(0.8)}
                  exiting={FadeOut(0.8)}
                  layout={LinearTransition}
                >
                  <Controller
                    name="targetDate"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DateInput
                        label="Target date"
                        placeholder="mm/dd/yyyy"
                        onChange={onChange}
                        value={value ? new Date(value) : undefined}
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
          <Button
            scale={0.98}
            onPress={form.handleSubmit(onSubmit)}
            isLoading={isPending}
          >
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
