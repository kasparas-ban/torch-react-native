import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { FormattedItems, ResponseItem } from "@/types/itemTypes"

import { HOST } from "../../utils/apiConfig"
import { CustomError, ItemLoadFetchErrorMsg } from "../../utils/errorMsgs"
import { formatItemResponse } from "../../utils/responseFormatters"

export const useItemsList = () => {
  const { getToken } = useAuth()

  const fetcher = async () => {
    let formattedItems = {
      tasks: [],
      goals: [],
      dreams: [],
      rawItems: [],
    } as FormattedItems

    try {
      const token = await getToken()
      if (!token) throw new Error("Token not found")

      const rawResponse = await fetch(`${HOST}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const jsonResponse: ResponseItem[] = await rawResponse.json()

      formattedItems = formatItemResponse(jsonResponse)
    } catch (err) {
      throw new CustomError(err as string, ItemLoadFetchErrorMsg)
    }

    return formattedItems
  }

  const query = useQuery({ queryKey: ["items"], queryFn: fetcher })

  return {
    ...query,
    tasks: query.data?.tasks,
    goals: query.data?.goals,
    dreams: query.data?.dreams,
  }
}
