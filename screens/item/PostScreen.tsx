/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {StatusBar, ScrollView} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
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
    <SafeAreaView edges={["top"]}style={{flex: 1, backgroundColor: colors.mainColor}}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
        <ScrollView style={{flex: 1, backgroundColor: colors.mainColor}} 
          showsVerticalScrollIndicator={false}>
          <TitleBar/>
          <SearchBar/>
          <PostImage img={placeholder7}/>
          <PostImageOptions/>
          <ArtistInfo/>
          <Commentary/>
          <Related/>
          <TabBar manualInset={true}/>
        </ScrollView>
    </SafeAreaView>
  )
}

export default PostScreen