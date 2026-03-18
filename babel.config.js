module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    ["module-resolver", {
       alias: {
         "path": "path-browserify",
         "crypto": "react-native-quick-crypto",
         "stream": "readable-stream",
         "buffer": "react-native-quick-crypto"
       }
    }],
    "react-native-worklets/plugin"
  ]
}