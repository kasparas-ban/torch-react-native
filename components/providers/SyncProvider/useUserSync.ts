import { wsStore } from "@/stores/websocketStore"
import { ProfileResp } from "@/types/userTypes"
import useDev from "@/components/dev/useDev"

import { getUserUpdateOp } from "./opFormatters"

export default function useUserSync() {
  const { isOnline } = useDev()

  const updateUser = (newData: ProfileResp) => {
    const ws = wsStore.getState().ws
    if (!isOnline || !ws) return
    const updateOp = getUserUpdateOp(newData)
    ws.send(JSON.stringify(updateOp))
  }

  return { updateUser }
}
