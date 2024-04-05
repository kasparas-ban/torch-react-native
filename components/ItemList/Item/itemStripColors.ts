import Colors from "@/constants/Colors"
import { ItemStatus } from "@/types/itemTypes"

export const getStripBgColor = (
  itemStatus: ItemStatus,
  isRecurring?: boolean
) => {
  if (itemStatus === "COMPLETED") {
    return Colors.green[50]
  }

  if (isRecurring) {
    if (itemStatus !== "ACTIVE") {
      return Colors.amber[50]
    }

    return Colors.amber[300]
  }

  if (itemStatus !== "ACTIVE") {
    return Colors.red[50]
  }

  return Colors.red[300]
}

export const getStripPercentageColor = (
  itemStatus: ItemStatus,
  isRecurring?: boolean
) => {
  if (itemStatus === "COMPLETED") {
    return Colors.green[300]
  }

  if (isRecurring) {
    if (itemStatus !== "ACTIVE") {
      return Colors.amber[300]
    }
    return Colors.amber[50]
  }

  if (itemStatus !== "ACTIVE") {
    return Colors.red[300]
  }

  return Colors.red[50]
}
