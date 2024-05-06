import { useStorageHydration } from "../Timer/hooks/useTimerSettings"

export function StorageProvider() {
  useStorageHydration()

  return null
}
