import { HOST } from "@/api-endpoints/utils/apiConfig"
import { CustomError, PostFetchErrorMsg } from "@/api-endpoints/utils/errorMsgs"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ItemType, ResponseItem } from "@/types/itemTypes"
import {
  NewDreamType,
  NewGoalType,
  NewTaskType,
  UpdateDreamType,
  UpdateGoalType,
  UpdateTaskType,
} from "@/components/itemModal/itemForms/schemas"

export const useUpsertItem = (type: ItemType) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const { data, mutate, isPending, isError, isSuccess, mutateAsync, reset } =
    useMutation({
      mutationFn: async (
        item:
          | NewTaskType
          | NewGoalType
          | NewDreamType
          | UpdateTaskType
          | UpdateGoalType
          | UpdateDreamType
      ) => {
        const token = await getToken()
        const endpoint = (item as UpdateTaskType).itemID
          ? `${HOST}/update-item/${type.toLowerCase()}`
          : `${HOST}/add-item/${type.toLowerCase()}`
        const method = (item as UpdateTaskType).itemID ? "PUT" : "POST"

        if (token) {
          return fetch(endpoint, {
            method: method,
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(item),
          })
            .then(res => {
              if (!res.ok) throw new CustomError("", PostFetchErrorMsg)
              return res.json() as Promise<ResponseItem>
            })
            .catch(err => {
              throw new CustomError(err, PostFetchErrorMsg)
            })
        } else {
          // TODO: add to localStorage
        }
        return undefined
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["items"] })
      },
    })

  return { isPending, isError, isSuccess, data, mutate, mutateAsync, reset }
}
