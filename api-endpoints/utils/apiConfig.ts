export const HOST = process.env.__DEV__
  ? process.env.EXPO_PUBLIC_BE_HOSTNAME_DEV
  : process.env.EXPO_PUBLIC_BE_HOSTNAME

export const FE_HOST = process.env.__DEV__
  ? process.env.EXPO_PUBLIC_FE_HOSTNAME_DEV
  : process.env.EXPO_PUBLIC_FE_HOSTNAME
