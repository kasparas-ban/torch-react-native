import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: {
    position: "relative",
  },
  selectedIndicator: {
    position: "absolute",
    width: "100%",
    backgroundColor: "hsl(200, 8%, 94%)",
    borderRadius: 5,
    top: "50%",
  },
  selectedIndicatorHor: {
    position: "absolute",
    height: "100%",
    backgroundColor: "hsl(200, 8%, 94%)",
    borderRadius: 5,
    left: "50%",
  },
  scrollView: {
    overflow: "hidden",
    flex: 1,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    zIndex: 100,
  },
  optionHor: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    zIndex: 100,
  },
})
