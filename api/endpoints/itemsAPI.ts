import { ItemResponse } from "@/types/itemTypes"

import { HOST } from "../utils/apiConfig"

export async function getAllItems(token: string) {
  return fetch(`${HOST}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (!res.ok) throw Error("Failed to get all items")
    return res.json() as Promise<ItemResponse[]>
  })
}
