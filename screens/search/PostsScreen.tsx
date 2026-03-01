/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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
            <ImageGrid headerComponent={
              <>
                <TitleBar/>
                <SearchBar/>
                <SortBar/>
              </>
            }/>
            <TabBar/>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default PostsScreen