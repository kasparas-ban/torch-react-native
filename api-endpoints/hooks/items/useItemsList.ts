import MOCK_ITEMS from "@/data/items.json"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { SyncMetadata } from "@/types/generalTypes"
import {
  Dream,
  FormattedItems,
  Goal,
  ResponseItem,
  Task,
} from "@/types/itemTypes"

import { HOST } from "../../utils/apiConfig"
import { CustomError, ItemLoadFetchErrorMsg } from "../../utils/errorMsgs"
import { formatItemResponse } from "../../utils/responseFormatters"

export const useItemsList = () => {
  const { getToken } = useAuth()

  const fetcher = async () => {
    let formattedItems = {
      tasks: [] as Task[],
      goals: [] as Goal[],
      dreams: [] as Dream[],
      rawItems: [] as ResponseItem[],
    }

    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")

      const rawResponse = await fetch(`${HOST}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const jsonResponse: SyncMetadata<ResponseItem>[] =
        await rawResponse.json()
      formattedItems = formatItemResponse(jsonResponse)
    } catch (err) {
      throw new CustomError(err as string, ItemLoadFetchErrorMsg)
    }

    const syncedRawItems: SyncMetadata<ResponseItem>[] =
      formattedItems.rawItems.map(item => ({
        ...item,
        updatedAt: new Date().toISOString(),
        isSynced: true,
      }))
    return { ...formattedItems, rawItems: syncedRawItems }
  }

  const query = useQuery({ queryKey: ["items"], queryFn: fetcher })

  // return {
  //   ...query,
  //   data: MOCK_ITEMS as FormattedItems | undefined,
  //   tasks: MOCK_ITEMS?.tasks,
  //   goals: MOCK_ITEMS?.goals,
  //   dreams: MOCK_ITEMS?.dreams,
  // }
  return {
    ...query,
    tasks: query.data?.tasks,
    goals: query.data?.goals,
    dreams: query.data?.dreams,
  }
}
