import { UpdateItemProgressReq } from "@/api-endpoints/endpoints/itemAPI"
import { getItemsByType } from "@/api-endpoints/utils/helpers"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormattedItems, ItemOptionType, ResponseItem } from "@/types/itemTypes"
import useTimerForm from "@/components/Timer/hooks/useTimerForm"

import { HOST } from "../../utils/apiConfig"
import { CustomError, ItemLoadFetchErrorMsg } from "../../utils/errorMsgs"

export const useUpdateItemProgress = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { focusOn, setFocusOn } = useTimerForm()

  const fetcher = async (data: UpdateItemProgressReq) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")

      const rawResponse = await fetch(`${HOST}/update-item-progress`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
        body: JSON.stringify(data),
      })
      const jsonResponse: ResponseItem = await rawResponse.json()
      return jsonResponse
    } catch (err) {
      throw new CustomError(err as string, ItemLoadFetchErrorMsg)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: UpdateItemProgressReq) => fetcher(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["items"], (prev: FormattedItems) => {
        const newRawItems = prev.rawItems.map(item => {
          if (item.itemID === variables.itemID) {
            return { ...item, timeSpent: item.timeSpent + variables.timeSpent }
          }

          return item
        })

        const formattedItems = formatItemResponse(newRawItems)

        // Update focus item labels
        const focusOnItem = newRawItems.find(
          item => item.itemID === focusOn?.value
        )
        if (focusOnItem) {
          const itemOptions = getItemsByType({
            itemData: formattedItems,
            focusType: "ALL",
          })
          const newFocusItem = itemOptions.find(
            item => item.value === focusOn?.value
          ) as ItemOptionType
          newFocusItem && setFocusOn(newFocusItem)
        }

        return formattedItems
      })
    },
  })

  return mutation
}
