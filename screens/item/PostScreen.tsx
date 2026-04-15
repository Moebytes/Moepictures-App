/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef, useMemo} from "react"
import {View, StatusBar, FlatList} from "react-native"
import {RouteProp} from "@react-navigation/native"
import {Drawer} from "react-native-drawer-layout"
import {useThemeSelector, useLayoutSelector, useSessionSelector, 
useSearchSelector, useCacheSelector, useCacheActions} from "../../store"
import {StackParamList} from "../../App"
import {useGetPostQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import PostImage from "../../components/image/PostImage"
import GridImage from "../../components/image/GridImage"
import PostImageOptions from "../../components/post/PostImageOptions"
import PostDrawer from "../../components/post/PostDrawer"
import PixivTags from "../../components/post/PixivTags"
import ArtistInfo from "../../components/post/ArtistInfo"
import Variations from "../../components/post/Variations"
import Parent from "../../components/post/Parent"
import Children from "../../components/post/Children"
import Groups from "../../components/post/Groups"
import ActiveFavgroup from "../../components/post/ActiveFavgroup"
import ArtistWorks from "../../components/post/ArtistWorks"
import BuyLink from "../../components/post/BuyLink"
import CutenessMeter from "../../components/post/CutenessMeter"
import Commentary from "../../components/post/Commentary"
import Comments from "../../components/post/Comments"
import Related, {useRelatedItems} from "../../components/post/Related"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import SearchSuggestions from "../../components/tooltip/SearchSuggestions"
import FullscreenModal from "../../modals/FullscreenModal"
import CropModal from "../../modals/CropModal"
import {ImageRef} from "../../components/image/FilterImage"
import {createStylesheet} from "./styles/PostScreen.styles"
import functions from "../../functions/Functions"
import {Image} from "../../types/Types"

type Props = {
  route: RouteProp<StackParamList, "Post">
}

const PostScreen: React.FunctionComponent<Props> = ({route}) => {
  const {session} = useSessionSelector()
  const {theme, colors} = useThemeSelector()
  const {tablet, statusBarVisible, postDrawerSwipe} = useLayoutSelector()
  const {tagCategories} = useCacheSelector()
  const {setTagCategories, setNavigationPosts} = useCacheActions()
  const {scroll, sizeType, square} = useSearchSelector()
  const [open, setOpen] = useState(false)
  const {postID} = route.params
  const {data: post} = useGetPostQuery({postID})
  const [image, setImage] = useState<Image | null>(null)
  const styles = createStylesheet(colors)
  const ref = useRef<FlatList>(null)
  const imageRef = useRef<ImageRef>(null)

  useEffect(() => {
      ref.current?.scrollToOffset({offset: 0})
  }, [route.params])

  const updateImage = () => {
    if (!post) return
    setImage(post.images[0])
  }

  const updateCategories = async () => {
    if (!post) return
    const tags = await functions.tag.parseTags([post], session)
    const categories = await functions.tag.tagCategories(tags, session)
    setTagCategories(categories)
  }

  const saveHistory = async () => {
    if (post && session.username) {
      await functions.http.post("/api/post/view", {postID: post.postID}, session)
    }
  }

  useEffect(() => {
    updateImage()
    updateCategories()
    saveHistory()
  }, [post])

  const openDrawer = () => {
    setOpen((prev) => !prev)
  }

  const onImageChange = (img: Image) => {
    setImage(img)
  }

  const characterTag = tagCategories?.characters?.[0]?.tag
  const seriesTag = tagCategories?.series?.[0]?.tag
  const artistTag = tagCategories?.artists?.[0]?.tag
  
  const related = useRelatedItems({
    tag: characterTag,
    fallback: [seriesTag, artistTag].filter(Boolean) as string[],
    post
  })

  const onRelatedPress = () => {
    if (!post) return
    if (related.posts.length) {
      setNavigationPosts(functions.post.appendIfNotExists(post, related.posts))
    }
  }

  const {columns} = functions.image.getImageSize(sizeType, square, tablet)

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition="right"
      swipeEnabled={postDrawerSwipe}
      drawerStyle={{backgroundColor: "transparent"}}
      drawerType="front"
      overlayStyle={{backgroundColor: "transparent"}}
      renderDrawerContent={() => <PostDrawer post={post} artists={tagCategories?.artists}
        characters={tagCategories?.characters} series={tagCategories?.series} meta={tagCategories?.meta}
        tags={tagCategories?.tags}/>}
      swipeEdgeWidth={100}>
      <View style={{flex: 1, backgroundColor: colors.mainColor}}>
          <StatusBar hidden={!statusBarVisible} barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
          <SearchSuggestions/>
          <FullscreenModal post={post} image={image}/>
          <CropModal post={post} image={image}/>
          <FlatList
            ListHeaderComponent={
              <>
                <TitleBar/>
                <SearchBar random={true}/>
                <Variations post={post} onImageChange={onImageChange}/>
                <PostImage post={post} image={image} imageRef={imageRef}/>
                <PostImageOptions openDrawer={openDrawer} post={post} imageRef={imageRef}/>
                <PixivTags post={post}/>
                <ArtistInfo post={post} artists={tagCategories?.artists}/>
                <View style={{gap: 10}}>
                  <ActiveFavgroup post={post}/>
                  <Parent post={post}/>
                  <Children post={post}/>
                  <Groups post={post}/>
                  <CutenessMeter post={post}/>
                  <BuyLink post={post}/>
                  <Commentary post={post}/>
                  <ArtistWorks tag={artistTag}/>
                  <Comments post={post} listRef={ref}/>
                  <Related/>
                </View>
              </>
            }
            ref={ref}
            key={columns}
            data={related.posts}
            renderItem={({item}) => <GridImage post={item} onPress={onRelatedPress}/>}
            keyExtractor={(item) => item.postID.toString()}
            numColumns={columns}
            columnWrapperStyle={columns !== 1 ? styles.row : undefined}

            onEndReached={scroll ? related.loadMore : undefined}
            onEndReachedThreshold={scroll ? 0.1 : undefined}

            contentContainerStyle={{backgroundColor: colors.background}}
            ListHeaderComponentStyle={{paddingBottom: 10}}
            ListFooterComponentStyle={{paddingTop: 10}}
            
            showsVerticalScrollIndicator={false}

            ListFooterComponent={!scroll ? <>
              <PageButtons page={related.page} setPage={related.setPage} 
              totalPages={related.totalPages} hideEndArrow={true}
              marginBottom={20}/>
              <BackToTop ref={ref}/>
              <TabBar relative={true}/>
              </> : <>
              <BackToTop ref={ref}/>
              <TabBar relative={true}/>
              </>}
          />
      </View>
    </Drawer>
  )
}

export default PostScreen