import {
  Dream,
  FormattedItems,
  GeneralItem,
  Goal,
  GroupedItems,
  ItemOptionType,
  ItemResponse,
  ItemStatus,
  ItemType,
  ReccuringPeriod,
  RecurringType,
  Task,
} from "@/types/itemTypes"
import { FocusType } from "@/components/Timer/hooks/useTimerForm"

import { ErrorResp } from "./errorMsgs"

export const groupItemsByParent = (
  items: GeneralItem[],
  itemType: ItemType
) => {
  let response = {} as
    | GroupedItems<Goal>
    | GroupedItems<Task>
    | GroupedItems<Dream>

  if (itemType === "GOAL") {
    const groupedItems = (items as Goal[]).reduce((prev, curr) => {
      const dreamTitle = curr.dream?.title || "Other"
      const groupLabel = curr.dream?.item_id || "other"
      const groupedGoals = prev[groupLabel]?.items || []

      return {
        ...prev,
        [groupLabel]: {
          parentLabel: dreamTitle,
          items: [...groupedGoals, curr],
        },
      }
    }, {} as GroupedItems<Goal>)

    response = groupedItems
  } else if (itemType === "TASK") {
    const groupedItems_1 = (items as Task[]).reduce((prev_1, curr_1) => {
      const goalTitle = curr_1.goal?.title || "Other"
      const groupLabel_1 = curr_1.goal?.item_id || "other"
      const groupedTasks = prev_1[groupLabel_1]?.items || []

      return {
        ...prev_1,
        [groupLabel_1]: {
          parentLabel: goalTitle,
          items: [...groupedTasks, curr_1],
        },
      }
    }, {} as GroupedItems<Task>)

    response = groupedItems_1
  } else if (itemType === "DREAM") {
    response = { empty: { items: items as Dream[] } }
  }
  return response
}

export const getItemsByType = ({
  itemData,
  focusType,
  grouped,
}: {
  itemData?: FormattedItems
  focusType: FocusType
  grouped?: boolean
}) => {
  const [allTasks, allGoals, allDreams] = [
    itemData?.tasks || [],
    itemData?.goals || [],
    itemData?.dreams || [],
  ]

  const selectedItems =
    focusType === "TASKS"
      ? allTasks
      : focusType === "GOALS"
        ? allGoals
        : focusType === "DREAMS"
          ? allDreams
          : [...allTasks, ...allGoals, ...allDreams]

  const filteredItems =
    selectedItems?.map(item => ({
      label: item.title,
      value: item.item_id,
      type: item.item_type,
      progress: item.progress,
      timeSpent: item.time_spent,
      totalTimeSpent: (item as Goal)?.totalTimeSpent,
      containsTasks:
        !!(item as Goal).tasks?.length ||
        !!(item as Dream).goals?.find(goal => !!(goal as Goal).tasks?.length),
      duration:
        (item as Task)?.duration ||
        (item as Goal).tasks?.reduce(
          (prev, curr) => (prev += curr.duration || 0),
          0
        ),
      parent: (item as Task).goal?.item_id || (item as Goal).dream?.item_id,
    })) || []

  if (grouped) {
    if (focusType === "ALL" || focusType === "DREAMS") return filteredItems

    const groupedItems = filteredItems.reduce(
      (prev, curr) => {
        const parent =
          curr.type === "TASK"
            ? allGoals.find(goal => goal.item_id === curr.parent)
            : allDreams.find(dream => dream.item_id === curr.parent)

        if (!parent) {
          const otherGroup = {
            label: "Other",
            value: "other",
            options: [
              ...(prev.find(gr => gr.value === "other")?.options || []),
              curr,
            ],
          }

          return [...prev.filter(gr => gr.value !== "other"), otherGroup]
        }

        if (prev.find(group => group.value === parent?.item_id)) {
          return prev.map(group => ({
            ...group,
            options: [...group.options, curr],
          }))
        } else {
          return [
            ...prev,
            { label: parent?.title, value: parent?.item_id, options: [curr] },
          ]
        }
      },
      [] as { label: string; value: string; options: ItemOptionType[] }[]
    )

    return groupedItems
  }

  return filteredItems
}

export const findItemByID = (
  item_id: string,
  formattedItems?: FormattedItems
) => {
  let item
  item = formattedItems?.dreams.find(item => item.item_id === item_id)
  if (item) return item

  item = formattedItems?.goals.find(item => item.item_id === item_id)
  if (item) return item

  item = formattedItems?.tasks.find(item => item.item_id === item_id)
  if (item) return item
}

export const countAssociatedTasks = (
  goal: GeneralItem,
  allItems: ItemResponse[]
) => {
  return allItems.filter(item => item.parent_id === goal.item_id).length
}

export const filterItemsByStatus = (
  filterBy: ItemStatus[],
  items?: (Task | Goal | Dream)[]
) => {
  if (!items) return []
  if (!filterBy.length) return items

  let activeItems = items.filter(item => filterBy.includes(item.status))

  activeItems = activeItems.map(item => {
    const filteredGoals = (item as Dream).goals?.filter(i =>
      filterBy.includes(i.status)
    )
    if (filteredGoals) return { ...item, goals: filteredGoals }

    const filteredTasks = (item as Goal).tasks?.filter(i =>
      filterBy.includes(i.status)
    )
    if (filteredTasks) return { ...item, tasks: filteredTasks }

    return item
  })

  return activeItems
}

// export const formatTimerHistory = (
//   timerData: TimerHistoryResponse[],
//   formattedItems: FormattedItems
// ) => {
//   const formattedData = timerData.map(record => {
//     const time_spent = dayjs(record.endTime).diff(
//       dayjs(record.startTime),
//       "seconds"
//     )

//     const item = findItemByID(record.item_id, formattedItems)

//     let progressDifference
//     if ((item as Task).duration) {
//       const duration = (item as Task).duration
//       progressDifference = duration ? time_spent / duration : undefined
//     } else {
//       const totalDuration = (item as Goal).tasks?.reduce(
//         (prev, curr) => (prev += curr.duration || 0),
//         0
//       )
//       progressDifference = totalDuration ? time_spent / totalDuration : undefined
//     }

//     return {
//       focusOn: item
//         ? {
//             value: record.item_id,
//             label: item.title,
//             type: item.type,
//           }
//         : undefined,
//       startTime: dayjs(record.startTime).format("HH:mm A"),
//       finishTime: dayjs(record.endTime).format("HH:mm A"),
//       progress: item?.progress,
//       progressDifference,
//       time_spent,
//     }
//   })

//   return formattedData
// }

export const handleFetch = async <T>(res: Response, errorMsg?: string) => {
  try {
    const data = (await res.json()) as T | ErrorResp
    if (!res.ok) {
      throw Error(
        (data as ErrorResp)?.error || errorMsg || "Failed to reach the server"
      )
    }

    return data
  } catch (e) {
    throw Error(e as string)
  }
}
