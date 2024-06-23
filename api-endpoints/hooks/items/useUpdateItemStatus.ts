import { UpdateItemStatusReq } from "@/api-endpoints/endpoints/itemAPITypes"
import { HOST } from "@/api-endpoints/utils/apiConfig"
import { CustomError } from "@/api-endpoints/utils/errorMsgs"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ItemResponse } from "@/types/itemTypes"

export const useUpdateItemStatus = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (body: UpdateItemStatusReq) => {
      const token = await getToken()
      const endpoint = `${HOST}/update-status`

      if (token) {
        return fetch(endpoint, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        })
          .then(res => {
            if (!res.ok)
              throw new CustomError("", {
                title: `Failed to update ${body.itemType.toLowerCase()} status`,
                description: "Try changing it again later.",
              })
            return res.json() as Promise<ItemResponse>
          })
          .catch(err => {
            throw new CustomError(err, {
              title: `Failed to update ${body.itemType.toLowerCase()} status`,
              description: "Try changing it again later.",
            })
          })
      }
      return undefined
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  return mutation
}
