export const HOST = __DEV__
  ? process.env.EXPO_PUBLIC_BE_HOSTNAME_DEV
  : process.env.EXPO_PUBLIC_BE_HOSTNAME

export const FE_HOST = __DEV__
  ? process.env.EXPO_PUBLIC_FE_HOSTNAME_DEV
  : process.env.EXPO_PUBLIC_FE_HOSTNAME
