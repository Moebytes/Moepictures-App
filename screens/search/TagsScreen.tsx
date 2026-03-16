/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, StatusBar, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import TagRow from "../../components/search/TagRow"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/CommentsScreen.styles"

interface Tag {
    tag: string
    count: number
    text: string
    type: string
}

let data = [
    {tag: "solo", count: 43326, type: "tag", text: "The post only contains a single character."},
    {tag: "long hair", count: 40743, type: "tag", text: "Hair that extends beyond the shoulders."},
    {tag: "smile", count: 23049, type: "tag", text: "A facial expression indicating happiness or friendliness."},
    {tag: "hair ornament", count: 20547, type: "accessory", text: "An accessory worn in the hair for decoration."},
    {tag: "blue eyes", count: 17768, type: "tag", text: "Eyes colored blue."},
    {tag: "skirt", count: 17162, type: "outfit", text: "A garment hanging from the waist covering part of the legs."},
    {tag: "very long hair", count: 14892, type: "tag", text: "Hair that extends well beyond the waist or knees."},
    {tag: "halo", count: 14850, type: "accessory", text: "Glowing ring or aura around character’s head, angelic symbolism"},
    {tag: "shirt", count: 14625, type: "outfit", text: "Basic upper body clothing garment"},
    {tag: "bow", count: 14323, type: "accessory",text: "A tied ribbon or decorative knot."},
    {tag: "animal ears", count: 14314, type: "tag",text: "Ears of animals, often worn as accessories or depicted on characters."},
    {tag: "twintails", count: 13644, type: "tag",text: "Two ponytails, usually on either side of the head."},
    {tag: "white bg", count: 12423, type: "scenery",text: "A plain white background"},
    {tag: "dress", count: 12382, type: "outfit",text: "A one-piece garment for women or girls."},
    {tag: "simple bg", count: 12066, type: "scenery",text: "A background with minimal detail or design."}
] as Tag[]

const TagsScreen: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()
  const {headerHeight, tabBarHeight} = useLayoutSelector()
  const styles = createStylesheet(colors)
  const [tabVisible, setTabVisible] = useState(true)
  const {handleScroll} = useAutoHideScroll(setTabVisible)

  const renderItem: ListRenderItem<Tag> = ({item}) => {
      return <TagRow tag={item.tag} count={item.count} text={item.text} type={item.type}/>
  }

  const headerJSX = () => {
    return (
      <View style={styles.container}>
          <View style={styles.titleContainer}>
              <Text style={styles.title}>Tags</Text>
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
            data={[...data, ...data, ...data]} 
            renderItem={renderItem}
            keyExtractor={(_, i) => i.toString()}
            numColumns={1}
            ListHeaderComponent={headerJSX()}
            ListFooterComponent={<PageButtons/>}
            ListFooterComponentStyle={styles.footer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        />
        <TabBar visible={tabVisible}/>
    </View>
  )
}

export default TagsScreen