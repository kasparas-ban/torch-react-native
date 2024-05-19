import { ReactNode, useEffect } from "react"

import pb from "./PocketbaseConfig"

export default function PocketBaseListener({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    pb.realtime
      .subscribe("items", function (e) {
        console.log("realtime", e.record)
      })
      .catch(e => console.log("Subscription error", e))
    return () => {
      pb.realtime.unsubscribe()
    }
  }, [])

  return children
}
