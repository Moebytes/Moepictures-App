/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, StatusBar, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector} from "../../store"
import {useSearchCommentsQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import CommentRow from "../../components/search/CommentRow"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/CommentsScreen.styles"
import {CommentSearch} from "../../types/Types"

const CommentsScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()
  const {headerHeight, tabBarHeight} = useLayoutSelector()
  const styles = createStylesheet(colors)
  const [tabVisible, setTabVisible] = useState(true)
  const {handleScroll} = useAutoHideScroll(setTabVisible)
  const {data: comments} = useSearchCommentsQuery({offset: 0})

  const renderItem: ListRenderItem<CommentSearch> = ({item}) => {
      return <CommentRow comment={item}/>
  }

  const headerJSX = () => {
    return (
      <View style={styles.container}>
          <View style={styles.titleContainer}>
              <Text style={styles.title}>Comments</Text>
          </View>
      </View>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.mainColor}}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
        <AnimatedHeaderWrapper visible={tabVisible}>
          <TitleBar/>
          <SearchBar/>
        </AnimatedHeaderWrapper>
        <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{backgroundColor: colors.background, paddingTop: headerHeight, paddingBottom: tabBarHeight}}
            data={comments}
            renderItem={renderItem}
            keyExtractor={(_, i) => i.toString()}
            numColumns={1}
            ListHeaderComponent={headerJSX()}
            ListFooterComponent={<PageButtons/>}
            ListFooterComponentStyle={styles.footer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
        />
        <TabBar visible={tabVisible}/>
    </View>
  )
}

export default CommentsScreen