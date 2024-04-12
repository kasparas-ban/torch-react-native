import Colors from "@/constants/Colors"
import { Dimensions, Platform, StyleSheet } from "react-native"

export const CELL_COUNT = 6
export const CELL_SIZE =
  Dimensions.get("window").width / CELL_COUNT - 2 * CELL_COUNT
export const CELL_BORDER_RADIUS = 8
export const DEFAULT_CELL_BG_COLOR = "white"
export const NOT_EMPTY_CELL_BG_COLOR = Colors.gray[100]
export const ACTIVE_CELL_BG_COLOR = "white"

const styles = StyleSheet.create({
  codeFieldRoot: {
    height: CELL_SIZE,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  cell: {
    marginHorizontal: 4,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    ...Platform.select({ web: { lineHeight: 65 } }),
    fontSize: 30,
    textAlign: "center",
    borderRadius: CELL_BORDER_RADIUS,
    color: Colors.gray[700],
    backgroundColor: "#fff",

    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  // =======================

  root: {
    minHeight: 800,
    padding: 20,
  },
})

export default styles
