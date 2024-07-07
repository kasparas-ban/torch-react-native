import { ReactNode, useEffect, useMemo } from "react"
import { useSystem } from "@/library/powersync/system"
import useSession from "@/stores/useSession"
import { PowerSyncContext } from "@powersync/react-native"

export default function PowersyncProvider({
  children,
}: {
  children: ReactNode
}) {
  const system = useSystem()
  const {
    powersync,
    supabaseConnector: { client },
  } = system

  const db = useMemo(() => {
    return powersync
  }, [])

  const { setSession } = useSession()

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    system.init()
  }, [])

  return (
    <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>
  )
}
