import { GetToken } from "@clerk/types/dist"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormattedItems, ItemResponse, ItemType } from "@/types/itemTypes"
import { useAuth } from "@/lib/clerk"
import { UpsertItem } from "@/api/endpoints/itemAPITypes"
import { HOST } from "@/api/utils/apiConfig"
import { CustomError, PostFetchErrorMsg } from "@/api/utils/errorMsgs"
import { formatItemResponse } from "@/api/utils/responseFormatters"
import { getRandomId } from "@/utils/randomId"
import { UpdateTaskType } from "@/components/itemModal/itemForms/schemas"

export const useUpsertItem = (type: ItemType) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const { data, mutate, isPending, isError, isSuccess, mutateAsync, reset } =
    useMutation({
      networkMode: "always",
      mutationFn: async (item: UpsertItem) => upsertItem(getToken, type, item),
      onMutate: async (item: UpsertItem) => {
        await queryClient.cancelQueries({ queryKey: ["items"] })

        const oldData = queryClient.getQueryData(["items"]) as
          | FormattedItems
          | undefined

        const item_id = (item as UpdateTaskType).item_id

        if (item_id) {
          // Update an existing item
          const updatedItem = {
            ...oldData?.rawItems.find(i => i.item_id === item_id),
            ...item,
            updated_at: new Date().toISOString(),
            isSynced: false,
          }
          const newRawItems = oldData?.rawItems.map(item =>
            item.item_id === item_id ? updatedItem : item
          )

          const newItems = formatItemResponse(
            JSON.parse(JSON.stringify(newRawItems))
          )

          queryClient.setQueryData(["items"], newItems)
        } else {
          // Create new item
          const newItem: any = {
            ...item,
            item_id: getRandomId(),
            type,
            time_spent: 0,
            status: "ACTIVE",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isSynced: false,
            isNew: true,
          }
          const newItems = formatItemResponse([
            ...(oldData?.rawItems || []),
            newItem,
          ])

          queryClient.setQueryData(["items"], newItems)
        }
      },
      onSuccess: data => {
        const oldData = queryClient.getQueryData(["items"]) as
          | FormattedItems
          | undefined

        const updatedData =
          oldData?.rawItems.map(item =>
            item.item_id === data.item_id ? { ...item, isSynced: true } : item
          ) || []
        const formattedItems = formatItemResponse(updatedData)

        queryClient.setQueryData(["items"], formattedItems)
      },
    })

  return { isPending, isError, isSuccess, data, mutate, mutateAsync, reset }
}

const upsertItem = async (
  getToken: GetToken,
  type: string,
  item: UpsertItem
) => {
  const token = await getToken()
  if (!token) throw new Error("Failed to load token")

  const endpoint = (item as UpdateTaskType).item_id
    ? `${HOST}/update-item/${type.toLowerCase()}`
    : `${HOST}/add-item/${type.toLowerCase()}`
  const method = (item as UpdateTaskType).item_id ? "PUT" : "POST"

  return fetch(endpoint, {
    method: method,
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  })
    .then(res => {
      if (!res.ok) throw new CustomError("", PostFetchErrorMsg)
      return res.json() as Promise<ItemResponse>
    })
    .catch(err => {
      throw new CustomError(err, PostFetchErrorMsg)
    })
}
