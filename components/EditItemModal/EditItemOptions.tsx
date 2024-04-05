import AddItemIcon from "@/assets/icons/add_item.svg"
import ArrowIcon from "@/assets/icons/chevronRight.svg"
import DeleteIcon from "@/assets/icons/delete.svg"
import EditIcon from "@/assets/icons/edit.svg"
import StatsIcon from "@/assets/icons/stats.svg"
import TickIcon from "@/assets/icons/tick.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { AnimatedButton } from "@/components/AnimatedButton"

type CardProps = {
  setCard: React.Dispatch<React.SetStateAction<"DONE" | "REMOVE" | undefined>>
}

export default function EditCard({ setCard }: CardProps) {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View
      style={{
        alignItems: "center",
        maxWidth: 240,
        width: "100%",
        backgroundColor: "white",
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 14,
      }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 12,
            gap: 8,
          }}
          scale={0.98}
          onPress={() => setCard("DONE")}
        >
          <TickIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Done</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>

        <View style={styles.separator} />

        {/* {showAddTask && ( */}
        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
        >
          <AddItemIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Add task</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>
        {/* )} */}

        <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
        >
          <StatsIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Stats</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
        >
          <EditIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Edit</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
          onPress={() => setCard("REMOVE")}
        >
          <DeleteIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Remove</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.gray[700],
      textAlign: "center",
    },
    progress: {
      fontSize: 42,
      color: Colors.rose[500],
      fontWeight: "900",
    },
    editlabel: {
      color: Colors.gray[800],
      fontSize: 13,
      flexGrow: 1,
    },
    arrowIcon: {
      marginTop: 2,
      width: 20,
      height: 20,
    },
    editIcon: {
      width: 20,
      height: 20,
    },
    separator: {
      backgroundColor: Colors.gray[500],
      height: StyleSheet.hairlineWidth,
      width: "100%",
    },
  })
