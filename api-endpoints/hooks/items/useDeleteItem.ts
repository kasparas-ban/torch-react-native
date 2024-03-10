import { HOST } from "@/api-endpoints/utils/apiConfig"
import { CustomError } from "@/api-endpoints/utils/errorMsgs"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ItemType } from "@/types/itemTypes"

type DeleteItemReq = {
  itemID: string
  itemType: ItemType
  deleteAssociated: boolean
}

export const useDeleteItem = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (body: DeleteItemReq) => {
      const token = await getToken()
      const endpoint = `${HOST}/delete-item`

      if (token) {
        return fetch(endpoint, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        })
          .then(res => {
            if (!res.ok)
              throw new CustomError("", {
                title: `Failed to delete ${body.itemType.toLowerCase()}`,
                description: "Try deleting it again later.",
              })
          })
          .catch(err => {
            throw new CustomError(err, {
              title: `Failed to delete ${body.itemType.toLowerCase()}`,
              description: "Try deleting it again later.",
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
