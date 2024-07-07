import { ItemRecord } from "@/library/powersync/AppSchema"
import { Dream, Goal, ItemStatus, Task } from "@/types/itemTypes"

const formatTaskResponse = (tasks: ItemRecord[]) => {
  return tasks.map(task => ({
    itemID: task.id,
    title: task.title,
    type: task.item_type,
    status: task.status,
    timeSpent: task.time_spent,
    targetDate: task.target_date,
    priority: task.priority,
    duration: task.duration,
    parentID: task.parent_id,
    recurring:
      task.rec_times && task.rec_period
        ? {
            period: task.rec_period,
            times: task.rec_times,
            progress: task.rec_progress || 0,
            updatedAt: task.rec_updated_at,
          }
        : null,
    updatedAt: task.updated_at,
    createdAt: task.created_at,
    // Additional field
    progress: getProgress(task.time_spent, task.duration),
  }))
}

const formatGoalResponse = (
  tasks: ItemRecord[],
  goals: ItemRecord[],
  dreams: ItemRecord[]
) => {
  return goals.map(goal => {
    const goalTasks = tasks.filter(item => item.parent_id === goal.id)

    let [tasksDuration, tasksSpentTime] = [0, 0]
    goalTasks.forEach(task => {
      tasksDuration += task.duration || 0
      tasksSpentTime += task.time_spent
    })

    return {
      itemID: goal.id,
      title: goal.title,
      type: goal.item_type,
      status: goal.status,
      timeSpent: goal.time_spent,
      targetDate: goal.target_date,
      priority: goal.priority,
      parentID: goal.parent_id,
      updatedAt: goal.updated_at,
      createdAt: goal.created_at,
      // Additional fields
      progress: getProgress(tasksSpentTime, tasksDuration),
      parent: dreams.find(dream => dream.id === goal.parent_id) || null,
      totalTimeSpent: goal.time_spent + tasksSpentTime,
    }
  })
}

const formatDreamResponse = (
  tasks: ItemRecord[],
  goals: ItemRecord[],
  dreams: ItemRecord[]
) => {
  return dreams.map(dream => {
    const dreamGoals = goals.filter(goal => goal.parent_id === dream.id)

    let [tasksDuration, tasksSpentTime] = [0, 0]
    dreamGoals.forEach(goal => {
      tasks.forEach(task => {
        if (task.parent_id === goal.id) {
          tasksDuration += task.duration || 0
          tasksSpentTime += task.time_spent
        }
      })
    })

    return {
      itemID: dream.id,
      title: dream.title,
      type: dream.item_type,
      status: dream.status,
      timeSpent: dream.time_spent,
      targetDate: dream.target_date,
      priority: dream.priority,
      updatedAt: dream.updated_at,
      createdAt: dream.created_at,
      // Additional fields
      progress: getProgress(tasksSpentTime, tasksDuration),
      totalTimeSpent: dream.time_spent + tasksSpentTime,
    }
  })
}

export const formatItemResponse = (response: ItemRecord[]) => {
  const tasksResp = response.filter(item => item.item_type === "TASK")
  const goalsResp = response.filter(item => item.item_type === "GOAL")
  const dreamsResp = response.filter(item => item.item_type === "DREAM")

  let tasks = formatTaskResponse(tasksResp)
  let goals = formatGoalResponse(tasksResp, goalsResp, dreamsResp)
  let dreams = formatDreamResponse(tasksResp, goalsResp, dreamsResp)

  // Add child & parent elements
  const formattedTasks: Task[] = tasks.map(task => {
    return {
      ...task,
      parent: goals.find(goal => goal.itemID === task.parentID) || null,
    }
  })

  const formattedGoals: Goal[] = goals.map(goal => {
    const { parentID, ...rest } = goal
    return {
      ...rest,
      tasks: tasks.filter(task => task.parentID === goal.itemID),
      parent: dreams.find(dream => dream.itemID === parentID) || null,
    }
  })

  const formattedDream: Dream[] = dreams.map(dream => {
    return {
      ...dream,
      goals: goals.filter(goal => goal.parentID === dream.itemID),
    }
  })

  return {
    tasks: sortItemsByStatus(formattedTasks),
    goals: sortItemsByStatus(formattedGoals),
    dreams: sortItemsByStatus(formattedDream),
    rawItems: response,
  }
}

const getProgress = (timeSpent: number, duration?: number | null) => {
  const progress = duration
    ? Math.round((timeSpent / duration) * 1000) / 1000
    : 0
  return progress > 1 ? 1 : progress
}

const sortItemsByStatus = <T extends Task | Goal | Dream>(items: T[]) => {
  const sortFunc = <K extends { status: ItemStatus }>(list: K[]) =>
    list.sort((a, b) => {
      if (a.status === "ARCHIVED") {
        return 1
      } else if (b.status === "ARCHIVED") {
        return -1
      }
      return 0
    })

  let sortedItems = sortFunc(items)
  sortedItems = sortedItems.map(item => {
    const goals = (item as Dream).goals
    if (goals) return { ...item, goals: sortFunc(goals) }

    const tasks = (item as Goal).tasks
    if (tasks) return { ...item, tasks: sortFunc(tasks) }

    return item
  })

  return sortedItems
}
