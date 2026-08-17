/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef} from "react"
import {View, StatusBar, FlatList} from "react-native"
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
  const [showBackToTop, setShowBackToTop] = useState(false)
  const ref = useRef<FlatList>(null)
  const isLoading = useRef(false)

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
        <AnimatedHeaderWrapper visible={tabVisible}>
            <TitleBar/>
            <SearchBar random={true} spaceEnabled={true}/>
            <SortBar/>
        </AnimatedHeaderWrapper>
        <SearchSuggestions/>
        <ImageGrid ref={ref} onScrollChange={setTabVisible} 
          setShowBackToTop={setShowBackToTop} isLoading={isLoading}/>
        <TabBar visible={tabVisible} backToTop={true} ref={ref} 
          showBackToTop={showBackToTop} isLoading={isLoading.current}/>
    </View>
  )
}

export default PostsScreen