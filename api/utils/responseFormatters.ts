import { Dream, Goal, ItemResponse, ItemStatus, Task } from "@/types/itemTypes"

const formatTaskResponse = (tasks: ItemResponse[]) => {
  return tasks.map(task => ({
    ...task,
    progress: getProgress(task.time_spent, task.duration),
  }))
}

const formatGoalResponse = (
  tasks: ItemResponse[],
  goals: ItemResponse[],
  dreams: ItemResponse[]
) => {
  return goals.map(goal => {
    const goalTasks = tasks.filter(item => item.parent_id === goal.item_id)

    let [tasksDuration, tasksSpentTime] = [0, 0]
    goalTasks.forEach(task => {
      tasksDuration += task.duration || 0
      tasksSpentTime += task.time_spent
    })

    return {
      ...goal,
      progress: getProgress(tasksSpentTime, tasksDuration),
      dream: dreams.find(dream => dream.item_id === goal.parent_id) || null,
      totalTimeSpent: goal.time_spent + tasksSpentTime,
    }
  })
}

const formatDreamResponse = (
  tasks: ItemResponse[],
  goals: ItemResponse[],
  dreams: ItemResponse[]
) => {
  return dreams.map(dream => {
    const dreamGoals = goals.filter(goal => goal.parent_id === dream.item_id)

    let [tasksDuration, tasksSpentTime] = [0, 0]
    dreamGoals.forEach(goal => {
      tasks.forEach(task => {
        if (task.parent_id === goal.item_id) {
          tasksDuration += task.duration || 0
          tasksSpentTime += task.time_spent
        }
      })
    })

    return {
      ...dream,
      progress: getProgress(tasksSpentTime, tasksDuration),
      totalTimeSpent: dream.time_spent + tasksSpentTime,
    }
  })
}

export const formatItemResponse = (response: ItemResponse[]) => {
  const tasksResp = response.filter(item => item.item_type === "TASK")
  const goalsResp = response.filter(item => item.item_type === "GOAL")
  const dreamsResp = response.filter(item => item.item_type === "DREAM")

  let tasks = formatTaskResponse(tasksResp)
  let goals = formatGoalResponse(tasksResp, goalsResp, dreamsResp)
  let dreams = formatDreamResponse(tasksResp, goalsResp, dreamsResp)

  // Add child & parent elements
  const formattedTasks: Task[] = tasks.map(task => {
    const { parent_id, ...rest } = task
    return {
      ...rest,
      goal: goals.find(goal => goal.item_id === parent_id) || null,
    }
  })

  const formattedGoals: Goal[] = goals.map(goal => {
    const { parent_id, ...rest } = goal
    return {
      ...rest,
      tasks: tasks.filter(task => task.parent_id === goal.item_id),
      dream: dreams.find(dream => dream.item_id === parent_id) || null,
    }
  })

  const formattedDream: Dream[] = dreams.map(dream => {
    return {
      ...dream,
      goals: goals.filter(goal => goal.parent_id === dream.item_id),
    }
  })

  return {
    tasks: sortItemsByStatus(formattedTasks),
    goals: sortItemsByStatus(formattedGoals),
    dreams: sortItemsByStatus(formattedDream),
    rawItems: response,
  }
}

const getProgress = (time_spent: number, duration: number | null) => {
  const progress = duration
    ? Math.round((time_spent / duration) * 1000) / 1000
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
