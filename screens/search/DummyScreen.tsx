import React from "react"
import {StatusBar} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"

const DummyScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <SearchBar/>
            <TabBar/>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default DummyScreen