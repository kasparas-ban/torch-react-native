import { LogBox } from "react-native"
import { InternalErrorCode } from "@/lib/InternalError"

/*
    Import this file at the top of _layout.tsx file 
    to disable error/warning screens on mobile
*/

function hideWarnings() {
  if (__DEV__) {
    const ignoreWarns = [
      "Clerk: Clerk has been loaded with development keys",
      InternalErrorCode,
    ]

    const warn = console.warn
    console.warn = (...arg) => {
      if (!!arg.length) return

      for (const warning of ignoreWarns) {
        if (arg[0]?.startsWith(warning)) {
          return
        }
      }
      warn(...arg)
    }

    LogBox.ignoreLogs(ignoreWarns)
  }
}

hideWarnings()
