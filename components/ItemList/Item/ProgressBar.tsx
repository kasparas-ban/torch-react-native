import { View } from "react-native"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { getProgressBgColor } from "./itemStripColors"

function ItemProgress({
  progress,
  showEditPanel,
  isActive,
  isRecurring,
}: {
  progress: number
  showEditPanel: boolean
  isActive?: boolean
  isRecurring?: boolean
}) {
  const { editItem } = useEditItem()

  const progressColor = getProgressBgColor(
    !!editItem,
    showEditPanel,
    isActive,
    isRecurring
  )

  return (
    <View
      style={{
        width: `${Math.trunc(progress * 100)}%`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: progressColor,
      }}
    />
  )
}

export default ItemProgress
