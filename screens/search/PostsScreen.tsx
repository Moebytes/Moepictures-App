/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, StatusBar} from "react-native"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import SortBar from "../../components/app/SortBar"
import ImageGrid from "../../components/search/ImageGrid"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import SearchSuggestions from "../../components/tooltip/SearchSuggestions"

const PostsScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()
  const [tabVisible, setTabVisible] = useState(true)

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
        <AnimatedHeaderWrapper visible={tabVisible}>
            <TitleBar/>
            <SearchBar/>
            <SortBar/>
        </AnimatedHeaderWrapper>
        <SearchSuggestions/>
        <ImageGrid onScrollChange={setTabVisible}/>
        <TabBar visible={tabVisible}/>
    </View>
  )
}

export default PostsScreen