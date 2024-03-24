import { create } from "zustand"
import { FormattedItem } from "@/types/itemTypes"

type EditModeState = {
  editItem?: FormattedItem
  setEditItem: (newEditItem?: FormattedItem) => void
}

const useEditItemStore = create<EditModeState>(set => ({
  editItem: undefined,
  setEditItem: (newEditItem?: FormattedItem) =>
    set(() => ({ editItem: newEditItem })),
}))

const useEditItem = () => ({
  editItem: useEditItemStore(state => state.editItem),
  setEditItem: useEditItemStore(state => state.setEditItem),
})

export default useEditItem
