import React from "react"
import {StatusBar, View} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "./store"
import TitleBar from "./components/app/TitleBar"

const App: React.FunctionComponent = () => {
  const {colors} = useThemeSelector()

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
        <StatusBar barStyle="dark-content"/>
        <TitleBar/>
        <View style={{flex: 1, backgroundColor: "white"}}/>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App