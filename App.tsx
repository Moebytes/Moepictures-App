import React from "react"
import {StatusBar, useColorScheme, View, Text} from "react-native"

const App: React.FunctionComponent = () => {
  const theme = useColorScheme()

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
      <Text>Hello World</Text>
    </View>
  )
}

export default App