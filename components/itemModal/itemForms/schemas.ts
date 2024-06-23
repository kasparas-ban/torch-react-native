import { z } from "zod"

export const dreamFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be longer than 2 characters." })
    .max(50, { message: "Title must be shorter than 50 characters." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  target_date: z.string().nullable().optional(),
})

export type DreamFormType = z.infer<typeof dreamFormSchema>
export type NewDreamType = DreamFormType
export type UpdateDreamType = NewDreamType & { item_id?: string }

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be longer than 2 characters." })
    .max(50, { message: "Title must be shorter than 50 characters." }),
  duration: z.number().nullable().optional(),
  goal: z.string().optional().nullable(),
  target_date: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  recurring: z
    .object({
      times: z.number().gt(0, "Value must be > 1"),
      period: z.enum(["DAY", "WEEK", "MONTH"]),
    })
    .nullable()
    .optional(),
})

export type TaskFormType = z.infer<typeof taskFormSchema>
export type NewTaskType = Omit<TaskFormType, "goal"> & {
  parent_id?: string
}
export type UpdateTaskType = NewTaskType & { item_id?: string }

export const goalFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be longer than 2 characters." })
    .max(50, { message: "Title must be shorter than 50 characters." }),
  dream: z.string().optional(),
  target_date: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().nullable(),
})

export type GoalFormType = z.infer<typeof goalFormSchema>
export type NewGoalType = Omit<GoalFormType, "dream" | "tasks"> & {
  parent_id?: string
}
export type UpdateGoalType = Omit<NewGoalType, "tasks"> & {
  item_id?: string
}

const subtaskFormSchema = taskFormSchema
  .extend({ item_id: z.string() })
  .omit({ goal: true })
export type SubitemType = z.infer<typeof subtaskFormSchema>
export type SubitemKeyType = keyof SubitemType

export const accountFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must contain at least 5 characters" })
    .max(20, { message: "Username cannot exceed 20 characters" }),
  birthday: z.date().optional(),
  gender: z
    .union([
      z.object({ label: z.literal("Male"), value: z.literal("MALE") }),
      z.object({ label: z.literal("Female"), value: z.literal("FEMALE") }),
    ])
    .optional(),
  country: z.object({ label: z.string(), value: z.string() }).optional(),
})

export const emailFormSchema = z.object({ email: z.string().email() })

export const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" })
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).*$/, {
        message:
          "Password must contain at least one number and both lowercase and uppercase characters",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const deleteAccountFormSchema = z.object({
  password: z
    .string({ required_error: "Enter your password" })
    .min(1, { message: "Enter your password" }),
})
