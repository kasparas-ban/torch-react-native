import { z } from 'zod';
import type { Prisma } from './prismaClient';
import { type TableSchema, DbSchema, ElectricClient, type HKT } from 'electric-sql/client/model';
import migrations from './migrations';
import pgMigrations from './pg-migrations';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ItemsScalarFieldEnumSchema = z.enum(['item_id','user_id','title','item_type','target_date','item_priority','duration','time_spent','rec_times','rec_period','rec_progress','rec_updated_at','parent_id','item_status','updated_at','created_at']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const item_period_enumSchema = z.enum(['WEEK','DAY','MONTH']);

export type item_period_enumType = `${z.infer<typeof item_period_enumSchema>}`

export const item_priority_enumSchema = z.enum(['LOW','MEDIUM','HIGH']);

export type item_priority_enumType = `${z.infer<typeof item_priority_enumSchema>}`

export const item_status_enumSchema = z.enum(['ACTIVE','COMPLETED','ARCHIVED']);

export type item_status_enumType = `${z.infer<typeof item_status_enumSchema>}`

export const item_type_enumSchema = z.enum(['TASK','GOAL','DREAM']);

export type item_type_enumType = `${z.infer<typeof item_type_enumSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ITEMS SCHEMA
/////////////////////////////////////////

export const ItemsSchema = z.object({
  item_type: item_type_enumSchema.nullable(),
  item_priority: item_priority_enumSchema.nullable(),
  rec_period: item_period_enumSchema.nullable(),
  item_status: item_status_enumSchema.nullable(),
  item_id: z.string(),
  user_id: z.string(),
  title: z.string(),
  target_date: z.coerce.date().nullable(),
  duration: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  time_spent: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  rec_times: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  rec_progress: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  rec_updated_at: z.coerce.date().nullable(),
  parent_id: z.string().nullable(),
  updated_at: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
})

export type Items = z.infer<typeof ItemsSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ITEMS
//------------------------------------------------------

export const ItemsSelectSchema: z.ZodType<Prisma.ItemsSelect> = z.object({
  item_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  title: z.boolean().optional(),
  item_type: z.boolean().optional(),
  target_date: z.boolean().optional(),
  item_priority: z.boolean().optional(),
  duration: z.boolean().optional(),
  time_spent: z.boolean().optional(),
  rec_times: z.boolean().optional(),
  rec_period: z.boolean().optional(),
  rec_progress: z.boolean().optional(),
  rec_updated_at: z.boolean().optional(),
  parent_id: z.boolean().optional(),
  item_status: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ItemsWhereInputSchema: z.ZodType<Prisma.ItemsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ItemsWhereInputSchema),z.lazy(() => ItemsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemsWhereInputSchema),z.lazy(() => ItemsWhereInputSchema).array() ]).optional(),
  item_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  item_type: z.union([ z.lazy(() => Enumitem_type_enumNullableFilterSchema),z.lazy(() => item_type_enumSchema) ]).optional().nullable(),
  target_date: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => Enumitem_priority_enumNullableFilterSchema),z.lazy(() => item_priority_enumSchema) ]).optional().nullable(),
  duration: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  time_spent: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rec_times: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => Enumitem_period_enumNullableFilterSchema),z.lazy(() => item_period_enumSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rec_updated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  parent_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => Enumitem_status_enumNullableFilterSchema),z.lazy(() => item_status_enumSchema) ]).optional().nullable(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ItemsOrderByWithRelationInputSchema: z.ZodType<Prisma.ItemsOrderByWithRelationInput> = z.object({
  item_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  item_type: z.lazy(() => SortOrderSchema).optional(),
  target_date: z.lazy(() => SortOrderSchema).optional(),
  item_priority: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_period: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional(),
  rec_updated_at: z.lazy(() => SortOrderSchema).optional(),
  parent_id: z.lazy(() => SortOrderSchema).optional(),
  item_status: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ItemsWhereUniqueInputSchema: z.ZodType<Prisma.ItemsWhereUniqueInput> = z.object({
  item_id: z.string().optional()
}).strict();

export const ItemsOrderByWithAggregationInputSchema: z.ZodType<Prisma.ItemsOrderByWithAggregationInput> = z.object({
  item_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  item_type: z.lazy(() => SortOrderSchema).optional(),
  target_date: z.lazy(() => SortOrderSchema).optional(),
  item_priority: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_period: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional(),
  rec_updated_at: z.lazy(() => SortOrderSchema).optional(),
  parent_id: z.lazy(() => SortOrderSchema).optional(),
  item_status: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ItemsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ItemsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ItemsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ItemsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ItemsSumOrderByAggregateInputSchema).optional()
}).strict();

export const ItemsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ItemsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ItemsScalarWhereWithAggregatesInputSchema),z.lazy(() => ItemsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemsScalarWhereWithAggregatesInputSchema),z.lazy(() => ItemsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  item_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  item_type: z.union([ z.lazy(() => Enumitem_type_enumNullableWithAggregatesFilterSchema),z.lazy(() => item_type_enumSchema) ]).optional().nullable(),
  target_date: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => Enumitem_priority_enumNullableWithAggregatesFilterSchema),z.lazy(() => item_priority_enumSchema) ]).optional().nullable(),
  duration: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  time_spent: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rec_times: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => Enumitem_period_enumNullableWithAggregatesFilterSchema),z.lazy(() => item_period_enumSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rec_updated_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  parent_id: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => Enumitem_status_enumNullableWithAggregatesFilterSchema),z.lazy(() => item_status_enumSchema) ]).optional().nullable(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  created_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ItemsCreateInputSchema: z.ZodType<Prisma.ItemsCreateInput> = z.object({
  item_id: z.string(),
  user_id: z.string(),
  title: z.string(),
  item_type: z.lazy(() => item_type_enumSchema).optional().nullable(),
  target_date: z.coerce.date().optional().nullable(),
  item_priority: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  duration: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  time_spent: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_times: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_period: z.lazy(() => item_period_enumSchema).optional().nullable(),
  rec_progress: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_updated_at: z.coerce.date().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  item_status: z.lazy(() => item_status_enumSchema).optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable()
}).strict();

export const ItemsUncheckedCreateInputSchema: z.ZodType<Prisma.ItemsUncheckedCreateInput> = z.object({
  item_id: z.string(),
  user_id: z.string(),
  title: z.string(),
  item_type: z.lazy(() => item_type_enumSchema).optional().nullable(),
  target_date: z.coerce.date().optional().nullable(),
  item_priority: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  duration: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  time_spent: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_times: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_period: z.lazy(() => item_period_enumSchema).optional().nullable(),
  rec_progress: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_updated_at: z.coerce.date().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  item_status: z.lazy(() => item_status_enumSchema).optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable()
}).strict();

export const ItemsUpdateInputSchema: z.ZodType<Prisma.ItemsUpdateInput> = z.object({
  item_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  item_type: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NullableEnumitem_type_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  target_date: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NullableEnumitem_priority_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time_spent: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_times: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NullableEnumitem_period_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NullableEnumitem_status_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ItemsUncheckedUpdateInputSchema: z.ZodType<Prisma.ItemsUncheckedUpdateInput> = z.object({
  item_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  item_type: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NullableEnumitem_type_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  target_date: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NullableEnumitem_priority_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time_spent: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_times: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NullableEnumitem_period_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NullableEnumitem_status_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ItemsCreateManyInputSchema: z.ZodType<Prisma.ItemsCreateManyInput> = z.object({
  item_id: z.string(),
  user_id: z.string(),
  title: z.string(),
  item_type: z.lazy(() => item_type_enumSchema).optional().nullable(),
  target_date: z.coerce.date().optional().nullable(),
  item_priority: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  duration: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  time_spent: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_times: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_period: z.lazy(() => item_period_enumSchema).optional().nullable(),
  rec_progress: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  rec_updated_at: z.coerce.date().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  item_status: z.lazy(() => item_status_enumSchema).optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable()
}).strict();

export const ItemsUpdateManyMutationInputSchema: z.ZodType<Prisma.ItemsUpdateManyMutationInput> = z.object({
  item_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  item_type: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NullableEnumitem_type_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  target_date: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NullableEnumitem_priority_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time_spent: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_times: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NullableEnumitem_period_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NullableEnumitem_status_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ItemsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ItemsUncheckedUpdateManyInput> = z.object({
  item_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  item_type: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NullableEnumitem_type_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  target_date: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_priority: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NullableEnumitem_priority_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time_spent: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_times: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_period: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NullableEnumitem_period_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_progress: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rec_updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  item_status: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NullableEnumitem_status_enumFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const Enumitem_type_enumNullableFilterSchema: z.ZodType<Prisma.Enumitem_type_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_type_enumSchema).optional().nullable(),
  in: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const Enumitem_priority_enumNullableFilterSchema: z.ZodType<Prisma.Enumitem_priority_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  in: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const Enumitem_period_enumNullableFilterSchema: z.ZodType<Prisma.Enumitem_period_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_period_enumSchema).optional().nullable(),
  in: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const Enumitem_status_enumNullableFilterSchema: z.ZodType<Prisma.Enumitem_status_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_status_enumSchema).optional().nullable(),
  in: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ItemsCountOrderByAggregateInputSchema: z.ZodType<Prisma.ItemsCountOrderByAggregateInput> = z.object({
  item_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  item_type: z.lazy(() => SortOrderSchema).optional(),
  target_date: z.lazy(() => SortOrderSchema).optional(),
  item_priority: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_period: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional(),
  rec_updated_at: z.lazy(() => SortOrderSchema).optional(),
  parent_id: z.lazy(() => SortOrderSchema).optional(),
  item_status: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ItemsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ItemsAvgOrderByAggregateInput> = z.object({
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ItemsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ItemsMaxOrderByAggregateInput> = z.object({
  item_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  item_type: z.lazy(() => SortOrderSchema).optional(),
  target_date: z.lazy(() => SortOrderSchema).optional(),
  item_priority: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_period: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional(),
  rec_updated_at: z.lazy(() => SortOrderSchema).optional(),
  parent_id: z.lazy(() => SortOrderSchema).optional(),
  item_status: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ItemsMinOrderByAggregateInputSchema: z.ZodType<Prisma.ItemsMinOrderByAggregateInput> = z.object({
  item_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  item_type: z.lazy(() => SortOrderSchema).optional(),
  target_date: z.lazy(() => SortOrderSchema).optional(),
  item_priority: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_period: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional(),
  rec_updated_at: z.lazy(() => SortOrderSchema).optional(),
  parent_id: z.lazy(() => SortOrderSchema).optional(),
  item_status: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ItemsSumOrderByAggregateInputSchema: z.ZodType<Prisma.ItemsSumOrderByAggregateInput> = z.object({
  duration: z.lazy(() => SortOrderSchema).optional(),
  time_spent: z.lazy(() => SortOrderSchema).optional(),
  rec_times: z.lazy(() => SortOrderSchema).optional(),
  rec_progress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const Enumitem_type_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.Enumitem_type_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_type_enumSchema).optional().nullable(),
  in: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NestedEnumitem_type_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const Enumitem_priority_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.Enumitem_priority_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  in: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NestedEnumitem_priority_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const Enumitem_period_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.Enumitem_period_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_period_enumSchema).optional().nullable(),
  in: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NestedEnumitem_period_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const Enumitem_status_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.Enumitem_status_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_status_enumSchema).optional().nullable(),
  in: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NestedEnumitem_status_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableEnumitem_type_enumFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumitem_type_enumFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => item_type_enumSchema).optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableEnumitem_priority_enumFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumitem_priority_enumFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => item_priority_enumSchema).optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableEnumitem_period_enumFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumitem_period_enumFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => item_period_enumSchema).optional().nullable()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableEnumitem_status_enumFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumitem_status_enumFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => item_status_enumSchema).optional().nullable()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumitem_type_enumNullableFilterSchema: z.ZodType<Prisma.NestedEnumitem_type_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_type_enumSchema).optional().nullable(),
  in: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumitem_priority_enumNullableFilterSchema: z.ZodType<Prisma.NestedEnumitem_priority_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  in: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumitem_period_enumNullableFilterSchema: z.ZodType<Prisma.NestedEnumitem_period_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_period_enumSchema).optional().nullable(),
  in: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumitem_status_enumNullableFilterSchema: z.ZodType<Prisma.NestedEnumitem_status_enumNullableFilter> = z.object({
  equals: z.lazy(() => item_status_enumSchema).optional().nullable(),
  in: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumitem_type_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumitem_type_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_type_enumSchema).optional().nullable(),
  in: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_type_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_type_enumSchema),z.lazy(() => NestedEnumitem_type_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_type_enumNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumitem_priority_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumitem_priority_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_priority_enumSchema).optional().nullable(),
  in: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_priority_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_priority_enumSchema),z.lazy(() => NestedEnumitem_priority_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_priority_enumNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumitem_period_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumitem_period_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_period_enumSchema).optional().nullable(),
  in: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_period_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_period_enumSchema),z.lazy(() => NestedEnumitem_period_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_period_enumNullableFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumitem_status_enumNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumitem_status_enumNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => item_status_enumSchema).optional().nullable(),
  in: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  notIn: z.lazy(() => item_status_enumSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => item_status_enumSchema),z.lazy(() => NestedEnumitem_status_enumNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumitem_status_enumNullableFilterSchema).optional()
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ItemsFindFirstArgsSchema: z.ZodType<Prisma.ItemsFindFirstArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereInputSchema.optional(),
  orderBy: z.union([ ItemsOrderByWithRelationInputSchema.array(),ItemsOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ItemsScalarFieldEnumSchema.array().optional(),
}).strict() 

export const ItemsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ItemsFindFirstOrThrowArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereInputSchema.optional(),
  orderBy: z.union([ ItemsOrderByWithRelationInputSchema.array(),ItemsOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ItemsScalarFieldEnumSchema.array().optional(),
}).strict() 

export const ItemsFindManyArgsSchema: z.ZodType<Prisma.ItemsFindManyArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereInputSchema.optional(),
  orderBy: z.union([ ItemsOrderByWithRelationInputSchema.array(),ItemsOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ItemsScalarFieldEnumSchema.array().optional(),
}).strict() 

export const ItemsAggregateArgsSchema: z.ZodType<Prisma.ItemsAggregateArgs> = z.object({
  where: ItemsWhereInputSchema.optional(),
  orderBy: z.union([ ItemsOrderByWithRelationInputSchema.array(),ItemsOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const ItemsGroupByArgsSchema: z.ZodType<Prisma.ItemsGroupByArgs> = z.object({
  where: ItemsWhereInputSchema.optional(),
  orderBy: z.union([ ItemsOrderByWithAggregationInputSchema.array(),ItemsOrderByWithAggregationInputSchema ]).optional(),
  by: ItemsScalarFieldEnumSchema.array(),
  having: ItemsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const ItemsFindUniqueArgsSchema: z.ZodType<Prisma.ItemsFindUniqueArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereUniqueInputSchema,
}).strict() 

export const ItemsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ItemsFindUniqueOrThrowArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereUniqueInputSchema,
}).strict() 

export const ItemsCreateArgsSchema: z.ZodType<Prisma.ItemsCreateArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  data: z.union([ ItemsCreateInputSchema,ItemsUncheckedCreateInputSchema ]),
}).strict() 

export const ItemsUpsertArgsSchema: z.ZodType<Prisma.ItemsUpsertArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereUniqueInputSchema,
  create: z.union([ ItemsCreateInputSchema,ItemsUncheckedCreateInputSchema ]),
  update: z.union([ ItemsUpdateInputSchema,ItemsUncheckedUpdateInputSchema ]),
}).strict() 

export const ItemsCreateManyArgsSchema: z.ZodType<Prisma.ItemsCreateManyArgs> = z.object({
  data: ItemsCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() 

export const ItemsDeleteArgsSchema: z.ZodType<Prisma.ItemsDeleteArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  where: ItemsWhereUniqueInputSchema,
}).strict() 

export const ItemsUpdateArgsSchema: z.ZodType<Prisma.ItemsUpdateArgs> = z.object({
  select: ItemsSelectSchema.optional(),
  data: z.union([ ItemsUpdateInputSchema,ItemsUncheckedUpdateInputSchema ]),
  where: ItemsWhereUniqueInputSchema,
}).strict() 

export const ItemsUpdateManyArgsSchema: z.ZodType<Prisma.ItemsUpdateManyArgs> = z.object({
  data: z.union([ ItemsUpdateManyMutationInputSchema,ItemsUncheckedUpdateManyInputSchema ]),
  where: ItemsWhereInputSchema.optional(),
}).strict() 

export const ItemsDeleteManyArgsSchema: z.ZodType<Prisma.ItemsDeleteManyArgs> = z.object({
  where: ItemsWhereInputSchema.optional(),
}).strict() 

interface ItemsGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.ItemsArgs
  readonly type: Omit<Prisma.ItemsGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

export const tableSchemas = {
  items: {
    fields: new Map([
      [
        "item_id",
        "VARCHAR"
      ],
      [
        "user_id",
        "VARCHAR"
      ],
      [
        "title",
        "VARCHAR"
      ],
      [
        "item_type",
        "TEXT"
      ],
      [
        "target_date",
        "DATE"
      ],
      [
        "item_priority",
        "TEXT"
      ],
      [
        "duration",
        "INT4"
      ],
      [
        "time_spent",
        "INT4"
      ],
      [
        "rec_times",
        "INT4"
      ],
      [
        "rec_period",
        "TEXT"
      ],
      [
        "rec_progress",
        "INT4"
      ],
      [
        "rec_updated_at",
        "TIMESTAMP"
      ],
      [
        "parent_id",
        "VARCHAR"
      ],
      [
        "item_status",
        "TEXT"
      ],
      [
        "updated_at",
        "TIMESTAMP"
      ],
      [
        "created_at",
        "TIMESTAMP"
      ]
    ]),
    relations: [
    ],
    modelSchema: (ItemsCreateInputSchema as any)
      .partial()
      .or((ItemsUncheckedCreateInputSchema as any).partial()),
    createSchema: ItemsCreateArgsSchema,
    createManySchema: ItemsCreateManyArgsSchema,
    findUniqueSchema: ItemsFindUniqueArgsSchema,
    findSchema: ItemsFindFirstArgsSchema,
    updateSchema: ItemsUpdateArgsSchema,
    updateManySchema: ItemsUpdateManyArgsSchema,
    upsertSchema: ItemsUpsertArgsSchema,
    deleteSchema: ItemsDeleteArgsSchema,
    deleteManySchema: ItemsDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof ItemsUncheckedCreateInputSchema>,
    Prisma.ItemsCreateArgs['data'],
    Prisma.ItemsUpdateArgs['data'],
    Prisma.ItemsFindFirstArgs['select'],
    Prisma.ItemsFindFirstArgs['where'],
    Prisma.ItemsFindUniqueArgs['where'],
    never,
    Prisma.ItemsFindFirstArgs['orderBy'],
    Prisma.ItemsScalarFieldEnum,
    ItemsGetPayload
  >,
}

export const schema = new DbSchema(tableSchemas, migrations, pgMigrations)
export type Electric = ElectricClient<typeof schema>
