/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, StatusBar, ScrollView} from "react-native"
import {RouteProp} from "@react-navigation/native"
import {Drawer} from "react-native-drawer-layout"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useCacheSelector, useCacheActions} from "../../store"
import {StackParamList} from "../../App"
import {useGetPostQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import PostImage from "../../components/image/PostImage"
import PostImageOptions from "../../components/post/PostImageOptions"
import PostDrawer from "../../components/post/PostDrawer"
import PixivTags from "../../components/post/PixivTags"
import ArtistInfo from "../../components/post/ArtistInfo"
import Commentary from "../../components/post/Commentary"
import Related from "../../components/post/Related"
import SearchSuggestions from "../../components/tooltip/SearchSuggestions"
import functions from "../../functions/Functions"

type Props = {
  route: RouteProp<StackParamList, "Post">
}

const PostScreen: React.FunctionComponent<Props> = ({route}) => {
  const {session} = useSessionSelector()
  const {theme, colors} = useThemeSelector()
  const {tabBarHeight} = useLayoutSelector()
  const {tagCategories} = useCacheSelector()
  const {setTagCategories} = useCacheActions()
  const [open, setOpen] = useState(false)
  const {postID} = route.params
  const {data: post} = useGetPostQuery({postID})
  const ref = useRef<ScrollView>(null)

  useEffect(() => {
      ref.current?.scrollTo({y: 0, animated: true})
  }, [route.params])

  useEffect(() => {
    const updateCategories = async () => {
      if (!post) return
      const tags = await functions.tag.parseTags([post], session)
      const categories = await functions.tag.tagCategories(tags, session)
      setTagCategories(categories)
    }
    updateCategories()
  }, [post])

  const openDrawer = () => {
    setOpen((prev) => !prev)
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition="right"
      drawerStyle={{backgroundColor: "transparent"}}
      drawerType="front"
      overlayStyle={{backgroundColor: "transparent"}}
      renderDrawerContent={() => <PostDrawer post={post} artists={tagCategories?.artists}
        characters={tagCategories?.characters} series={tagCategories?.series} meta={tagCategories?.meta}
        tags={tagCategories?.tags}/>}
      swipeEdgeWidth={100}>
      <View style={{flex: 1, backgroundColor: colors.mainColor}}>
          <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
          <SearchSuggestions/>
          <ScrollView ref={ref} style={{flex: 1, backgroundColor: colors.mainColor}} 
            contentContainerStyle={{paddingBottom: tabBarHeight}}
            showsVerticalScrollIndicator={false}>
            <TitleBar/>
            <SearchBar random={true}/>
            <PostImage post={post}/>
            <PostImageOptions openDrawer={openDrawer} post={post}/>
            <PixivTags post={post}/>
            <ArtistInfo post={post} artists={tagCategories?.artists}/>
            <Commentary post={post}/>
            <Related tag={tagCategories?.characters[0]?.tag} 
            fallback={[tagCategories?.series[0]?.tag!, tagCategories?.artists[0]?.tag!]}/>
            <TabBar/>
          </ScrollView>
      </View>
    </Drawer>
  )
}

export default PostScreen