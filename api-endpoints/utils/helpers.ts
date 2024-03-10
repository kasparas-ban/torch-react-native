import dayjs from "dayjs"
import {
  Dream,
  FormattedItems,
  GeneralItem,
  Goal,
  GroupedItems,
  ItemStatus,
  ItemType,
  ReccuringPeriod,
  RecurringType,
  ResponseItem,
  Task,
} from "@/types/itemTypes"
import { FocusType } from "@/components/Timer/hooks/useTimerForm"

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
      const groupLabel = curr.dream?.itemID || "other"
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
      const groupLabel_1 = curr_1.goal?.itemID || "other"
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
      value: item.itemID,
      type: item.type,
      progress: item.progress,
      timeSpent: item.timeSpent,
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
      parent: (item as Task).goal?.itemID || (item as Goal).dream?.itemID,
    })) || []

  if (grouped) {
    if (focusType === "ALL" || focusType === "DREAMS") return filteredItems

    const parents =
      focusType === "TASKS"
        ? allGoals.filter(goal =>
            filteredItems.find(item => item.parent === goal.itemID)
          )
        : allDreams.filter(dream =>
            filteredItems.find(item => item.parent === dream.itemID)
          )

    const groupedItems = parents.map(parent => ({
      label: parent.title,
      value: parent.itemID,
      options: filteredItems.filter(item => item.parent === parent.itemID),
    }))

    return groupedItems
  }

  return filteredItems
}

export const findItemByID = (
  itemID: string,
  formattedItems?: FormattedItems
) => {
  let item
  item = formattedItems?.dreams.find(item => item.itemID === itemID)
  if (item) return item

  item = formattedItems?.goals.find(item => item.itemID === itemID)
  if (item) return item

  item = formattedItems?.tasks.find(item => item.itemID === itemID)
  if (item) return item
}

export const countAssociatedTasks = (
  goal: GeneralItem,
  allItems: ResponseItem[]
) => {
  return allItems.filter(item => item.parentID === goal.itemID).length
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
//     const timeSpent = dayjs(record.endTime).diff(
//       dayjs(record.startTime),
//       "seconds"
//     )

//     const item = findItemByID(record.itemID, formattedItems)

//     let progressDifference
//     if ((item as Task).duration) {
//       const duration = (item as Task).duration
//       progressDifference = duration ? timeSpent / duration : undefined
//     } else {
//       const totalDuration = (item as Goal).tasks?.reduce(
//         (prev, curr) => (prev += curr.duration || 0),
//         0
//       )
//       progressDifference = totalDuration ? timeSpent / totalDuration : undefined
//     }

//     return {
//       focusOn: item
//         ? {
//             value: record.itemID,
//             label: item.title,
//             type: item.type,
//           }
//         : undefined,
//       startTime: dayjs(record.startTime).format("HH:mm A"),
//       finishTime: dayjs(record.endTime).format("HH:mm A"),
//       progress: item?.progress,
//       progressDifference,
//       timeSpent,
//     }
//   })

//   return formattedData
// }
