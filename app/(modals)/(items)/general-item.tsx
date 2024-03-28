import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import Link from "@/components/UI/Link"

export default function GeneralItemModal() {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Text style={styles.title}>Select type</Text>
        </View>

        <View style={{ width: "100%", gap: 8 }}>
          <Link
            href="/(modals)/(items)/add-task"
            style={styles.typeBtn}
            scale={0.99}
          >
            <View style={{ gap: 4 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.typeTitle}>Add task</Text>
                <Text style={styles.typeTime}>(up to 24h)</Text>
              </View>
              <Text style={styles.typeExplanation}>
                One time or recurring short task
              </Text>
              <Text style={styles.typeExample}>
                Read 20 pages, run 3km, study for 2h...
              </Text>
            </View>
          </Link>

          <Link
            href="/(modals)/(items)/add-goal"
            style={styles.typeBtn}
            scale={0.99}
          >
            <View style={{ gap: 4 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.typeTitle}>Add goal</Text>
                <Text style={styles.typeTime}>(more than 24h)</Text>
              </View>
              <Text style={styles.typeExplanation}>
                Larger objective composed of smaller tasks
              </Text>
              <Text style={styles.typeExample}>
                Finish a book, run a marathon, pass the exam...
              </Text>
            </View>
          </Link>

          <Link
            href="/(modals)/(items)/add-dream"
            style={styles.typeBtn}
            scale={0.99}
          >
            <View style={{ gap: 4 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.typeTitle}>Add dream</Text>
                <Text style={styles.typeTime}>(years)</Text>
              </View>
              <Text style={styles.typeExplanation}>
                General aspiration to work towards
              </Text>
              <Text style={styles.typeExample}>
                Become a novelist, learn Spanish, finish university...
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: "center",
    },
    container: {
      flex: 1,
      marginTop: 100,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 24,
      maxWidth: 400,
      width: "100%",
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[500],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
    },
    typeBtn: {
      backgroundColor: isDark ? Colors.gray[700] : Colors.gray[300],
      width: "100%",
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: isDark ? Colors.gray[500] : Colors.gray[400],
    },
    typeTitle: {
      color: isDark ? Colors.gray[300] : Colors.gray[800],
      fontSize: 22,
      fontWeight: "600",
    },
    typeTime: {
      fontSize: 17,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
      marginLeft: 8,
    },
    typeExplanation: {
      color: isDark ? Colors.gray[300] : Colors.gray[800],
    },
    typeExample: {
      fontSize: 13,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
    },
  })
