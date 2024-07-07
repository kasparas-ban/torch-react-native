import {
  Column,
  ColumnType,
  Index,
  IndexedColumn,
  Schema,
  Table,
} from "@powersync/react-native"
import { ItemStatus, ItemType, ReccuringPeriod } from "@/types/itemTypes"

export const ITEM_TABLE = "items"

export interface ItemRecord {
  id: string
  user_id: string
  title: string
  item_type: ItemType
  status: ItemStatus
  time_spent: number
  // Optional
  target_date: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  duration: number | null
  parent_id: string | null
  rec_times: number | null
  rec_period: ReccuringPeriod | null
  rec_progress: number | null
  rec_updated_at: string | null
  // Metadata
  created_at: string
  updated_at: string
}

export const AppSchema = new Schema([
  new Table({
    name: "items",
    columns: [
      new Column({ name: "id", type: ColumnType.TEXT }),
      new Column({ name: "user_id", type: ColumnType.TEXT }),
      new Column({ name: "title", type: ColumnType.TEXT }),
      new Column({ name: "item_type", type: ColumnType.TEXT }),
      new Column({ name: "status", type: ColumnType.TEXT }),
      new Column({ name: "time_spent", type: ColumnType.INTEGER }),
      new Column({ name: "target_date", type: ColumnType.TEXT }),
      new Column({ name: "priority", type: ColumnType.TEXT }),
      new Column({ name: "duration", type: ColumnType.INTEGER }),
      new Column({ name: "parent_id", type: ColumnType.TEXT }),
      new Column({ name: "rec_times", type: ColumnType.INTEGER }),
      new Column({ name: "rec_period", type: ColumnType.TEXT }),
      new Column({ name: "rec_progress", type: ColumnType.INTEGER }),
      new Column({ name: "rec_updated_at", type: ColumnType.TEXT }),
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
    ],
    indexes: [
      new Index({
        name: "item",
        columns: [new IndexedColumn({ name: "id" })],
      }),
    ],
  }),
])
