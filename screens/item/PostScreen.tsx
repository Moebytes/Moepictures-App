import React from "react"
import {StatusBar, ScrollView} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import PostImage from "../../components/image/PostImage"
import PostImageOptions from "../../components/post/PostImageOptions"
import ArtistInfo from "../../components/post/ArtistInfo"
import Commentary from "../../components/post/Commentary"
import Related from "../../components/post/Related"

const placeholder7 = require("../../assets/images/placeholder/placeholder7.jpg")

const PostScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <ScrollView style={{flex: 1, backgroundColor: colors.mainColor}}>
              <TitleBar/>
              <SearchBar/>
              <PostImage img={placeholder7}/>
              <PostImageOptions/>
              <ArtistInfo/>
              <Commentary/>
              <Related/>
            </ScrollView>
            <TabBar/>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default PostScreen