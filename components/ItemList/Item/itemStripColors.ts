import Colors from "@/constants/Colors"
import { ItemStatus } from "@/types/itemTypes"

export const getStripBgColor = (
  isEditActive: boolean,
  isEditPanelActive: boolean,
  itemStatus: ItemStatus,
  isRecurring?: boolean
) => {
  if (itemStatus === "COMPLETED") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.green[50]
        : Colors.gray[50]
      : Colors.green[50]
  }

  if (isRecurring) {
    if (itemStatus !== "ACTIVE") {
      return isEditActive
        ? isEditPanelActive
          ? Colors.amber[50]
          : Colors.gray[50]
        : Colors.amber[50]
    }

    return isEditActive
      ? isEditPanelActive
        ? Colors.amber[300]
        : Colors.gray[300]
      : Colors.amber[300]
  }

  if (itemStatus !== "ACTIVE") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.red[50]
        : Colors.gray[50]
      : Colors.red[50]
  }

  return isEditActive
    ? isEditPanelActive
      ? Colors.red[300]
      : Colors.gray[300]
    : Colors.red[300]
}

export const getStripTextColor = (isActive?: boolean) => {
  return isActive ? Colors.gray[800] : Colors.gray[400]
}

export const getStripBorderColor = (isActive?: boolean) => {
  return isActive ? Colors.gray[700] : Colors.gray[400]
}

export const getStripBulletColor = (isActive?: boolean) => {
  return isActive ? Colors.gray[700] : Colors.gray[400]
}

export const getStripDotsColor = (
  isEditActive: boolean,
  isEditPanelActive: boolean,
  itemStatus: ItemStatus,
  isRecurring?: boolean
) => {
  if (itemStatus === "COMPLETED") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.green[100]
        : Colors.gray[100]
      : Colors.green[100]
  }

  if (isRecurring) {
    if (itemStatus !== "ACTIVE") {
      return isEditActive
        ? isEditPanelActive
          ? Colors.amber[100]
          : Colors.gray[100]
        : Colors.amber[100]
    }

    return isEditActive
      ? isEditPanelActive
        ? Colors.amber[200]
        : Colors.gray[100]
      : Colors.amber[200]
  }

  if (itemStatus !== "ACTIVE") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.red[100]
        : Colors.gray[100]
      : Colors.red[100]
  }

  return isEditActive
    ? isEditPanelActive
      ? Colors.red[200]
      : Colors.gray[200]
    : Colors.red[200]
}

export const getProgressBgColor = (
  isEditActive: boolean,
  isEditPanelActive: boolean,
  isActive?: boolean,
  isRecurring?: boolean
) => {
  if (isRecurring) {
    if (!isActive) {
      return isEditActive
        ? isEditPanelActive
          ? Colors.amber[100]
          : Colors.gray[100]
        : Colors.amber[100]
    }
    return isEditActive
      ? isEditPanelActive
        ? Colors.amber[500]
        : Colors.gray[300]
      : Colors.amber[500]
  }

  if (!isActive) {
    return isEditActive
      ? isEditPanelActive
        ? Colors.red[100]
        : Colors.gray[100]
      : Colors.red[100]
  }

  return isEditActive
    ? isEditPanelActive
      ? Colors.red[400]
      : Colors.gray[400]
    : Colors.red[400]
}

export const getStripPercentageColor = (
  isEditActive: boolean,
  isEditPanelActive: boolean,
  itemStatus: ItemStatus,
  isRecurring?: boolean
) => {
  if (itemStatus === "COMPLETED") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.green[300]
        : Colors.gray[300]
      : Colors.green[300]
  }

  if (isRecurring) {
    if (itemStatus !== "ACTIVE") {
      return isEditActive
        ? isEditPanelActive
          ? Colors.amber[300]
          : Colors.gray[300]
        : Colors.amber[300]
    }
    return isEditActive
      ? isEditPanelActive
        ? Colors.amber[50]
        : Colors.gray[400]
      : Colors.amber[50]
  }

  if (itemStatus !== "ACTIVE") {
    return isEditActive
      ? isEditPanelActive
        ? Colors.red[300]
        : Colors.gray[300]
      : Colors.red[300]
  }

  return isEditActive
    ? isEditPanelActive
      ? Colors.red[50]
      : Colors.gray[400]
    : Colors.red[50]
}
