import { useStorageHydration } from "@/components/Timer/hooks/useTimerSettings"

export function StorageProvider() {
  useStorageHydration()

  return null
}
