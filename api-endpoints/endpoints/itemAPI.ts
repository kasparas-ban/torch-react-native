import { ItemType, ResponseItem } from "@/types/itemTypes"

import { UpsertItem } from "../hooks/items/useUpsertItem"
import { HOST } from "../utils/apiConfig"
import { handleFetch } from "../utils/helpers"

export const updateItem = (token: string, item: UpsertItem, type: ItemType) =>
  fetch(`${HOST}/update-item/${type.toLowerCase()}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  }).then(res => handleFetch<ResponseItem>(res, "Failed to update item"))

export const addItem = (token: string, item: UpsertItem, type: ItemType) =>
  fetch(`${HOST}/add-item/${type.toLowerCase()}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  }).then(res => handleFetch<ResponseItem>(res, "Failed to add item"))
