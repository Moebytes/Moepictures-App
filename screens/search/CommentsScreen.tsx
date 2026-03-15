/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, StatusBar, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import CommentRow from "../../components/search/CommentRow"
import PageButtons from "../../components/search/PageButtons"
import {createStylesheet} from "./styles/CommentsScreen.styles"

const placeholder1 = require("../../assets/images/comments/placeholder1.jpg")
const placeholder2 = require("../../assets/images/comments/placeholder2.jpg")
const placeholder3 = require("../../assets/images/comments/placeholder3.jpg")
const placeholder4 = require("../../assets/images/comments/placeholder4.jpg")
const placeholder5 = require("../../assets/images/comments/placeholder5.jpg")
const placeholder6 = require("../../assets/images/comments/placeholder6.jpg")
const placeholder7 = require("../../assets/images/comments/placeholder7.jpg")

let images = [
    placeholder1, placeholder2, placeholder3, placeholder4, 
    placeholder5, placeholder6, placeholder7, 
    placeholder1, placeholder2, placeholder3, placeholder4, 
    placeholder5, placeholder6, placeholder7
]

const CommentsScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()
  const styles = createStylesheet(colors)

  const renderItem: ListRenderItem<ImageSourcePropType> = ({item}) => {
      return <CommentRow img={item}/>
  }

  const headerJSX = () => {
    return (
      <>
        <TitleBar/>
        <SearchBar/>
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Comments</Text>
            </View>
        </View>
      </>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
        <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{backgroundColor: colors.background}}
            data={images} 
            renderItem={renderItem}
            keyExtractor={(_, i) => i.toString()}
            numColumns={1}
            ListHeaderComponent={headerJSX()}
            ListFooterComponent={<PageButtons/>}
            ListFooterComponentStyle={styles.footer}
        />
        <TabBar/>
    </SafeAreaView>
  )
}

export default CommentsScreen