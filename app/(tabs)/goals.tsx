import { StyleSheet, View } from "react-native"
import ItemListWrapper from "@/components/ItemList/ItemListWrapper"

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <ItemListWrapper />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
})
