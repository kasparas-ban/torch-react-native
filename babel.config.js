module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-transform-async-generator-functions",
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  }
}
