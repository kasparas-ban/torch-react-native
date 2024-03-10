import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"
import useTimerStore from "@/components/Timer/hooks/useTimer"
import useTimerSettings from "@/components/Timer/hooks/useTimerSettings"
import Button from "@/components/UI/Button"
import TextInput from "@/components/UI/TextInput"

import InfoIcon from "../../assets/icons/info.svg"

const timerSettingsSchema = z.object({
  timer: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Duration must be a positive integer",
    })
    .min(1, { message: "Duration is required" })
    .refine(val => Number(val) > 0, {
      message: "Duration must be a positive integer",
    }),
  break: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Duration must be a positive integer",
    })
    .min(1, { message: "Duration is required" })
    .refine(val => Number(val) > 0, {
      message: "Duration must be a positive integer",
    }),
  longBreak: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Duration must be a positive integer",
    })
    .min(1, { message: "Duration is required" })
    .refine(val => Number(val) > 0, {
      message: "Duration must be a positive integer",
    }),
})

type TimerSettingsForm = z.infer<typeof timerSettingsSchema>

export default function TimerSettingsModal() {
  const { styles, isDark } = useThemeStyles(componentStyles)

  const {
    timerDuration,
    breakDuration,
    longBreakDuration,
    setDurations: setStorageDurations,
  } = useTimerSettings()

  const setTimerDurations = useTimerStore.use.setDurations()
  const resetTimer = useTimerStore.use.resetTimer()

  const defaultSettings = {
    timer: timerDuration.toString(),
    break: breakDuration.toString(),
    longBreak: longBreakDuration.toString(),
  }

  const form = useForm<TimerSettingsForm>({
    resolver: zodResolver(timerSettingsSchema),
    defaultValues: defaultSettings,
  })

  const onSavePress = (data: TimerSettingsForm) => {
    setStorageDurations(
      Number(data.timer),
      Number(data.break),
      Number(data.longBreak)
    )
    setTimerDurations(
      Number(data.timer) * 60,
      Number(data.break) * 60,
      Number(data.longBreak) * 60
    )
    resetTimer()
    router.back()
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: 100,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 24,
        maxWidth: 400,
        width: "100%",
        marginHorizontal: "auto",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginBottom: 18,
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Timer Settings</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginBottom: 18,
        }}
      >
        <InfoIcon style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Changing the settings will reset the timers.
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          marginBottom: 12,
          marginHorizontal: 24,
          justifyContent: "center",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={styles.headerDivider} />
        <Text style={styles.header}>Duration (min)</Text>
        <View style={styles.headerDivider} />
      </View>

      <Controller
        name="timer"
        control={form.control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Timer"
            keyboardType="number-pad"
            placeholder="25"
            onBlur={onBlur}
            maxLength={3}
            onChangeText={val => onChange(val.replace(/[^0-9]/g, ""))}
            value={value.toString()}
            errorProps={{ children: form.formState.errors.timer?.message }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <Controller
        name="break"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Break"
            keyboardType="number-pad"
            placeholder="5"
            onBlur={onBlur}
            maxLength={3}
            onChangeText={val => onChange(val.replace(/[^0-9]/g, ""))}
            value={value.toString()}
            errorProps={{ children: form.formState.errors.break?.message }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <Controller
        name="longBreak"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Long break"
            keyboardType="number-pad"
            placeholder="15"
            onBlur={onBlur}
            maxLength={3}
            onChangeText={val => onChange(val.replace(/[^0-9]/g, ""))}
            value={value.toString()}
            errorProps={{ children: form.formState.errors.longBreak?.message }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <View style={{ position: "absolute", bottom: 48, width: "100%" }}>
        <Button
          type="base"
          scale={0.97}
          onPress={form.handleSubmit(onSavePress)}
          style={{
            backgroundColor: rgbToRGBA(Colors.gray[300], isDark ? 0.2 : 0.7),
            height: 48,
          }}
          textProps={{
            style: {
              color: isDark ? Colors.gray[100] : Colors.gray[900],
            },
          }}
        >
          Save
        </Button>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    infoIcon: {
      color: Colors.amber[500],
      width: 24,
      height: 24,
    },
    infoText: {
      color: isDark ? Colors.gray[400] : Colors.gray[600],
    },
    title: {
      color: Colors.gray[400],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
    },
    header: {
      color: isDark ? Colors.gray[400] : Colors.gray[600],
      fontFamily: "GabaritoSemibold",
      fontSize: 18,
      fontWeight: "700",
    },
    headerDivider: {
      height: 1,
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[300],
      flex: 1,
    },
  })
