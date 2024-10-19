import COUNTRIES from "@/data/countries.json"

export const hexToRGB = (hex: string, alpha: number | undefined = 1) => {
  hex = hex.toUpperCase()

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const rgbToRGBA = (rgb: string, alpha: number | undefined = 1) => {
  const rgbValues = rgb.match(/\d+/g)
  if (!rgbValues || rgbValues.length !== 3) return rgb

  return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`
}

export function capitalize(text: string) {
  return text[0].toUpperCase() + text.substring(1).toLowerCase()
}

export const getCountry = (countryCode: string) => {
  return COUNTRIES.find(country => country.code === countryCode)
}

export const toPercent = (input?: number) => {
  if (input === undefined) return ""

  const percent = input * 100
  const rounded = Math.round(input * 100)

  if (percent !== 0 && rounded === 0) return "<0%"
  if (percent !== 100 && rounded === 100) return "99%"

  return `${rounded.toString()}%`
}

export const formatPercentages = (fraction?: number) => {
  if (fraction === undefined) return "-"
  const rounded = Math.round(fraction * 100 * 10) / 10

  if (rounded === 0 && fraction !== 0) return "<0.1"
  if (rounded === 100 && fraction !== 1) return ">99"

  return `${rounded}`
}

export const formatSpentTime = (totalSeconds: number) => {
  if (totalSeconds === 0) return "0 h"

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours && minutes) return `${hours} h ${minutes} min`
  if (hours) return `${hours} h`
  if (minutes) return `${minutes} min`
  if (seconds) return `${seconds} sec`
  return "0 h"
}

export const formatFullTime = (totalSeconds: number) => {
  if (totalSeconds === 0) return "0 sec"

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let time = ""
  if (hours) time += `${hours} h`
  if (minutes) time += `${time.length ? " " : ""}${minutes} min`
  if (seconds) time += `${time.length ? " " : ""}${seconds} sec`

  return time
}

export const formatDate = (date: Date) =>
  date.toISOString().slice(0, 19).replace("T", " ")

export const pruneObject = <T extends Object>(obj: T) => {
  const deepCopy = { ...obj }
  Object.keys(deepCopy).forEach(
    (key: string) =>
      !deepCopy[key as keyof T] && delete deepCopy[key as keyof T]
  )
  return deepCopy
}

export const getTime = (seconds?: number | null) => {
  const time = { hours: 0, minutes: 0, seconds: 0 }
  if (!seconds) return time

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return { hours, minutes, seconds: 0 }
}

export const defaultProfileImage =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

export function removeElsFromArray<T>(array: Array<T>, els: T[]) {
  const set = new Set(array)
  els.forEach(el => set.delete(el))
  return Array.from(set)
}
