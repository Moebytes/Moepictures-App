/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef, useMemo} from "react"
import {View, StatusBar, FlatList, useWindowDimensions, Text, Alert} from "react-native"
import {RouteProp, useNavigation} from "@react-navigation/native"
import {Drawer} from "react-native-drawer-layout"
import {useThemeSelector, useLayoutSelector, useSessionSelector, 
useSearchSelector, useCacheSelector, useCacheActions} from "../../store"
import {StackParamList} from "../../App"
import {useGetPostQuery, useGetPostHistoryQuery, useInvalidatePost} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
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
import RevertIcon from "../../assets/svg/backspace.svg"
import CurrentIcon from "../../assets/svg/current.svg"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import {Image, PostSearch, SourceData} from "../../types/Types"

type Props = {
  route: RouteProp<StackParamList, "Post">
}

const PostScreen: React.FunctionComponent<Props> = ({route}) => {
  const {session} = useSessionSelector()
  const {i18n, theme, colors} = useThemeSelector()
  const {tablet, statusBarVisible, postDrawerSwipe} = useLayoutSelector()
  const {tagCategories} = useCacheSelector()
  const {setTagCategories, setNavigationPosts} = useCacheActions()
  const {scroll, sizeType, square} = useSearchSelector()
  const [open, setOpen] = useState(false)
  const {width} = useWindowDimensions()
  const {postID, historyID} = route.params
  const [refreshKey, setRefreshKey] = useState(0)
  const {data: currentPost} = useGetPostQuery({postID, refreshKey})
  const {data: historyPosts} = useGetPostHistoryQuery({postID, historyID}, {skip: !historyID})
  const [image, setImage] = useState<Image | string | null>(null)
  const styles = createStylesheet(colors)
  const ref = useRef<FlatList>(null)
  const imageRef = useRef<ImageRef>(null)
  const navigation = useNavigation()
  const invalidatePost = useInvalidatePost()

  const historyPost = historyID && historyPosts?.length ? historyPosts[0] : null
  let post = historyPost ?? currentPost

  useEffect(() => {
      ref.current?.scrollToOffset({offset: 0})
  }, [route.params])

  const updateImage = async () => {
    if (!post) return
    let image = post.images[0]
    setImage(image)
  }

  const updateCategories = async () => {
    if (!post) return
    if ("historyID" in post) {
      const allTags = [...post.artists, ...post.characters, ...post.series, ...post.tags]
      const tags = await functions.cache.sortedTagCounts(allTags, session)
      const categories = await functions.tag.tagCategories(tags, session)
      setTagCategories(categories)
    } else {
      const tags = await functions.tag.parseTags([post], session)
      const categories = await functions.tag.tagCategories(tags, session)
      setTagCategories(categories)
    }
  }

  const saveHistory = async () => {
    if (post && session.username && permissions.isPremium(session)) {
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

  const onImageChange = (img: Image | string) => {
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

  const revertHistory = async () => {
    if (!historyPost) return
      let currentPost = await functions.http.get("/api/post", {postID}, session) as PostSearch
      if (historyPost.artists) {
          let categories = await functions.tag.tagCategories(currentPost.tags, session)
          currentPost.artists = categories.artists.map((a) => a.tag)
          currentPost.characters = categories.characters.map((c) => c.tag)
          currentPost.series = categories.series.map((s) => s.tag)
          currentPost.tags = [...categories.tags.map((t) => t.tag), ...categories.meta.map((m) => m.tag)]
      }

      Alert.alert(i18n.dialogs.revertPostHistory.title, i18n.dialogs.revertGroupHistory.header, [
          {text: i18n.buttons.cancel, style: "cancel"},
          {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
              const imgChanged = await functions.compare.imagesChanged(historyPost, currentPost, session)
              const tagsChanged = functions.compare.tagsChanged(historyPost, currentPost)
              const srcChanged = functions.compare.sourceChanged(historyPost, currentPost)
              let imageSources = functions.post.imageSourceMap(historyPost)
              let imageLinks = functions.post.imageLinkMap(historyPost)
              let source = null as SourceData | null
              if (imgChanged || srcChanged) {
                  source = {
                      title: historyPost.title,
                      englishTitle: historyPost.englishTitle,
                      artist: historyPost.artist,
                      posted: historyPost.posted ? functions.date.formatDate(new Date(historyPost.posted), true) : "",
                      source: historyPost.source,
                      commentary: historyPost.commentary,
                      englishCommentary: historyPost.englishCommentary,
                      bookmarks: historyPost.bookmarks,
                      buyLink: historyPost.buyLink,
                      pixivTags: historyPost.pixivTags,
                      userProfile: historyPost.userProfile,
                      drawingTools: historyPost.drawingTools,
                      sourceImageCount: historyPost.sourceImageCount,
                      mirrors: historyPost.mirrors ? Object.values(historyPost.mirrors).join("\n") : ""
                  }
              }
              if (imgChanged || (srcChanged && tagsChanged)) {
                  if (imgChanged && !permissions.isMod(session)) return Promise.reject("img")
                  const {images, upscaledImages} = await functions.post.parseImages(historyPost, session)
                  const newTags = await functions.post.parseNewTags(historyPost, session)

                  let {imageChunks, upscaledChunks} = functions.byte.chunkImages(images, upscaledImages)
                  await functions.byte.uploadChunks(imageChunks, upscaledChunks, session)

                  await functions.http.put("/api/post/edit", {postID: historyPost.postID, imageChunks, upscaledChunks, 
                  type: historyPost.type, rating: historyPost.rating, source: source!, style: historyPost.style, 
                  artists: functions.tag.tagObject(historyPost.artists), characters: functions.tag.tagObject(historyPost.characters), 
                  preserveChildren: Boolean(historyPost.parentID), series: functions.tag.tagObject(historyPost.series), 
                  parentID: historyPost.parentID, noImageUpdate: true, tags: historyPost.tags, tagGroups: historyPost.tagGroups, 
                  imageSources, imageLinks, newTags, reason: historyPost.reason}, session)
              } else {
                  await functions.http.put("/api/post/quickedit", {postID: historyPost.postID, type: historyPost.type, 
                  rating: historyPost.rating, source: source!, style: historyPost.style, artists: historyPost.artists, 
                  characters: historyPost.characters, series: historyPost.series, tags: historyPost.tags, imageSources,
                  imageLinks, tagGroups: historyPost.tagGroups, parentID: historyPost.parentID, reason: historyPost.reason}, 
                  session)
              }
              currentHistory()
          }}
      ], {cancelable: true})
  }

  const currentHistory = async () => {
      invalidatePost(postID)
      navigation.navigate("Post", {postID}, {pop: true})
      setRefreshKey((prev) => prev + 1)
  }

  const historyBarJSX = () => {
    if (!historyID) return null
    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyText}>{`[${i18n.sidebar.history}: ${historyID}]`}</Text>

        {permissions.isContributor(session) ?
        <PressableHaptic onPress={revertHistory} style={({pressed}) => [
            styles.historyButton, pressed && styles.historyButtonActive
        ]}>{({pressed}) => (
            <>
            <RevertIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
            <Text style={[styles.historyButtonText, 
                pressed && styles.historyButtonTextActive]}>{i18n.buttons.revert}</Text>
            </>
        )}
        </PressableHaptic> : null}

        <PressableHaptic onPress={currentHistory} style={({pressed}) => [
            styles.historyButton, pressed && styles.historyButtonActive
        ]}>{({pressed}) => (
            <>
            <CurrentIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
            <Text style={[styles.historyButtonText, 
                pressed && styles.historyButtonTextActive]}>{i18n.buttons.current}</Text>
            </>
        )}
        </PressableHaptic>
      </View>
    )
  }

  const {columns} = functions.image.getImageSize(sizeType, square, tablet, width)

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
                {historyBarJSX()}
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