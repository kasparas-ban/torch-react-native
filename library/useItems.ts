import { DeleteItemReq } from "@/api-endpoints/endpoints/itemAPITypes"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"
import { formatItemFormData, getAllAssociatedItems } from "@/stores/helpers"
import { useQuery } from "@powersync/react-native"
import { useMutation } from "@tanstack/react-query"
import { getRandomId } from "@/utils/randomId"

import { ItemRecord } from "./powersync/AppSchema"
import { useSystem } from "./powersync/system"

export function useItems() {
  const { powersync, supabaseConnector } = useSystem()

  const { data: rawItems } = useQuery<ItemRecord>("SELECT * FROM items")

  const allItems = formatItemResponse(rawItems)

  const { mutate: addItem } = useMutation({
    mutationFn: async (item: ReturnType<typeof formatItemFormData>) => {
      try {
        const { userID } = await supabaseConnector.fetchCredentials()

        await powersync.execute(
          `INSERT INTO items (id, user_id, title, item_type, status,
          target_date, priority, duration, parent_id, 
          rec_times, rec_period, rec_progress, rec_updated_at, 
          updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            getRandomId(),
            userID,
            item.title,
            item.type,
            "ACTIVE",
            item.targetDate,
            item.priority,
            item.duration,
            item.parentID,
            item.recurring?.times,
            item.recurring?.period,
            item.recurring && 0,
            item.recurring && new Date().toISOString(),
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        )
      } catch (e) {
        console.error("Failed to add item:", e)
      }
    },
  })

  const { mutate: updateItem } = useMutation({
    mutationFn: async (
      item: ReturnType<typeof formatItemFormData> & { itemID: string }
    ) => {
      try {
        const { userID } = await supabaseConnector.fetchCredentials()
        console.log("updating", item)

        await powersync.execute(
          `UPDATE items 
           SET title = ?, target_date = ?, priority = ?, duration = ?, parent_id = ?, 
           rec_times = ?, rec_period = ?, rec_progress = ?, rec_updated_at = ?, updated_at = ? 
           WHERE user_id = ? AND id = ?`,
          [
            item.title,
            item.targetDate,
            item.priority,
            item.duration,
            item.parentID,
            item.recurring?.times,
            item.recurring?.period,
            item.recurring && 0,
            item.recurring && new Date().toISOString(),
            new Date().toISOString(),
            userID,
            item.itemID,
          ]
        )
      } catch (e) {
        console.error("Failed to update item:", e)
      }
    },
  })

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (data: DeleteItemReq) => {
      try {
        const { userID } = await supabaseConnector.fetchCredentials()

        const deleteItemIds = data.deleteAssociated
          ? getAllAssociatedItems(rawItems, data.deleteItemId)
          : [data.deleteItemId]

        const promises = deleteItemIds.map(id => {
          powersync.execute(`DELETE FROM items WHERE user_id = ? AND id = ?`, [
            userID,
            id,
          ])
        })

        Promise.all(promises)
      } catch (e) {
        console.error("Failed to delete item:", e)
      }
    },
  })

  return { ...allItems, allItems, addItem, updateItem, deleteItem }
}
