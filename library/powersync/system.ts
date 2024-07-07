import "@azure/core-asynciterator-polyfill"
import "react-native-polyfill-globals/auto"

import React from "react"
import { Buffer } from "@craftzdog/react-native-buffer"
import {
  PowerSyncDatabase,
  SyncStreamConnectionMethod,
} from "@powersync/react-native"

import { KVStorage } from "../storage/KVStorage"
import { SupabaseStorageAdapter } from "../storage/SupabaseStorageAdapter"
import { SupabaseConnector } from "../supabase/SupabaseConnector"
import { AppSchema } from "./AppSchema"

// Polyfills for WebSockets
if (typeof global.Buffer == "undefined") {
  // @ts-expect-error If using TypeScript
  global.Buffer = Buffer
}

if (typeof process.nextTick == "undefined") {
  process.nextTick = setImmediate
}

export class System {
  kvStorage: KVStorage
  storage: SupabaseStorageAdapter
  supabaseConnector: SupabaseConnector
  powersync: PowerSyncDatabase

  constructor() {
    this.kvStorage = new KVStorage()
    this.supabaseConnector = new SupabaseConnector(this)
    this.storage = this.supabaseConnector.storage
    this.powersync = new PowerSyncDatabase({
      schema: AppSchema,
      database: {
        dbFilename: "sqlite.db",
      },
    })
  }

  async init() {
    await this.powersync.init()

    // @ts-ignore
    await this.powersync.connect(this.supabaseConnector, {
      connectionMethod: SyncStreamConnectionMethod.WEB_SOCKET,
    })
  }
}

export const system = new System()

export const SystemContext = React.createContext(system)
export const useSystem = () => React.useContext(SystemContext)
