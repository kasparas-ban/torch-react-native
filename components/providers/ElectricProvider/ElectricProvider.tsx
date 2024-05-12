import React, { useEffect, useState } from "react"
import { Electric, schema } from "@/db/generated/client"
import { useAuth } from "@clerk/clerk-expo"
import { electrify } from "electric-sql/expo-next"
import { makeElectricContext } from "electric-sql/react"
import * as SQLite from "expo-sqlite/next"

import { DEBUG_MODE, ELECTRIC_URL } from "./config"

const { ElectricProvider, useElectric } = makeElectricContext<Electric>()

const ElectricProviderComponent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [electric, setElectric] = useState<Electric>()
  const { getToken } = useAuth()

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const config = {
        debug: DEBUG_MODE,
        url: ELECTRIC_URL,
      }
      console.log("config", config)

      try {
        const conn = SQLite.openDatabaseSync("postgres.db")
        const client = await electrify(conn, schema, config)

        const token = await getToken()
        if (token) await client.connect(token)
        console.log("CONNECTED")

        if (!isMounted) return
        setElectric(client)
      } catch (e) {
        console.error(e)
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  if (electric === undefined) return children

  return <ElectricProvider db={electric}>{children}</ElectricProvider>
}

export { ElectricProviderComponent as ElectricProvider, useElectric }
