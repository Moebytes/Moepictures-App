/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, useEffect} from "react"
import {View, Text, StatusBar, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector, useSearchSelector} from "../../store"
import {useSearchCommentsInfiniteQuery, useSearchCommentsPageQuery} from "../../api"
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
  const {scroll} = useSearchSelector()
  const styles = createStylesheet(colors)
  const [tabVisible, setTabVisible] = useState(true)
  const {handleScroll} = useAutoHideScroll(setTabVisible)
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const ref = useRef<FlatList>(null)

  useEffect(() => {
      ref.current?.scrollToOffset({offset: 0, animated: true})
  }, [page])

  const pageSize = 15

  const infiniteQuery = useSearchCommentsInfiniteQuery(
      {refreshKey},
      {skip: !scroll}
  )

  const pageQuery = useSearchCommentsPageQuery(
      {offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
      {skip: scroll}
  )

  const comments = scroll
      ? (infiniteQuery.data?.pages.flat() ?? [])
      : (pageQuery.data ?? [])

  const renderItem: ListRenderItem<CommentSearch> = ({item}) => {
      return <CommentRow comment={item}/>
  }

  const isLoading = scroll
      ? infiniteQuery.isLoading
      : pageQuery.isLoading

  const loadMore = () => {
      if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
          infiniteQuery.fetchNextPage()
      }
  }

  const totalItems = Number(pageQuery.data?.[0].commentCount ?? 0)
  const totalPages = Math.ceil(totalItems / pageSize)

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
              ref={ref}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                  backgroundColor: colors.background,
                  marginTop: headerHeight,
                  paddingBottom: tabBarHeight
              }}
              data={comments} 
              renderItem={renderItem}
              keyExtractor={(item) => item.commentID.toString()}
              numColumns={1}

              refreshing={isLoading}
              onRefresh={() => setRefreshKey(prev => prev + 1)}
              refreshControl={
                  <RefreshControl
                      refreshing={isLoading}
                      onRefresh={() => setRefreshKey(prev => prev + 1)}
                      tintColor={colors.iconColor}
                      colors={[colors.iconColor]}
                      progressViewOffset={headerHeight}
                  />}

              onEndReached={scroll ? loadMore : undefined}
              onEndReachedThreshold={scroll ? 0.1 : undefined}
              ListHeaderComponent={headerJSX()}
              ListFooterComponent={!scroll ? <PageButtons page={page} 
                  setPage={setPage} totalPages={totalPages}/> : undefined}
              ListFooterComponentStyle={!scroll ? styles.footer : undefined}

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