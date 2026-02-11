import React from "react"
import {StatusBar} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import SortBar from "../../components/app/SortBar"
import ImageGrid from "../../components/search/ImageGrid"

const PostsScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <SearchBar/>
            <SortBar/>
            <ImageGrid/>
            <TabBar/>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default PostsScreen