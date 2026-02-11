import React from "react"
import {StatusBar, View} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "./store"
import TitleBar from "./components/app/TitleBar"
import SearchBar from "./components/app/SearchBar"
import SortBar from "./components/app/SortBar"
import NavBar from "./components/app/NavBar"

const App: React.FunctionComponent = () => {
  const {colors} = useThemeSelector()

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
        <StatusBar barStyle="dark-content"/>
        <TitleBar/>
        <SearchBar/>
        <SortBar/>
        <View style={{flex: 1, backgroundColor: "white"}}/>
        <NavBar/>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App