/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, useEffect} from "react"
import {View, Text, Image, StatusBar, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector, useSearchSelector, useSessionSelector} from "../../store"
import {useSearchCommentsInfiniteQuery, useSearchCommentsPageQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import CommentRow from "../../components/search/CommentRow"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/CommentsScreen.styles"
import {CommentSearch} from "../../types/Types"
import functions from "../../functions/Functions"

const noresults = require("../../assets/images/noresults.png")

const CommentsScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {scroll, ratingType, commentSort} = useSearchSelector()
    const styles = createStylesheet(colors)
    const [tabVisible, setTabVisible] = useState(true)
    const {handleScroll} = useAutoHideScroll(setTabVisible)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [text, setText] = useState("")
    const [search, setSearch] = useState("")
    const [searchTags, setSearchTags] = useState<string[]>([])
    const ref = useRef<FlatList>(null)

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    const pageSize = 15

    const infiniteQuery = useSearchCommentsInfiniteQuery(
        {query: search, sort: commentSort, refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useSearchCommentsPageQuery(
        {query: search, sort: commentSort,
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    const filterComments = (comments: CommentSearch[]) => {
        let filtered = [] as CommentSearch[]
        for (const comment of comments) {
            if (comment.post.type !== "image" && comment.post.type !== "comic") continue
            if (!session.username) if (comment.post.rating !== functions.r13()) continue
            if (!functions.post.isR18(ratingType)) if (functions.post.isR18(comment.post.rating)) continue
            filtered.push(comment)
        }
        return filtered
    }

    const comments = scroll
        ? filterComments((infiniteQuery.data?.pages.flat() ?? []))
        : filterComments((pageQuery.data ?? []))

    const isLoading = scroll
        ? infiniteQuery.isLoading
        : pageQuery.isLoading

    const renderItem: ListRenderItem<CommentSearch> = ({item}) => {
        return <CommentRow comment={item}/>
    }

    const renderEmpty = () => {
        if (isLoading) return null
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                <Image source={noresults} style={{width: 350, height: 350, resizeMode: "contain"}}/>
            </View>
        )
    }


    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(pageQuery.data?.[0]?.commentCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    const headerJSX = () => {
        if (isLoading) return null

        return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{i18n.navbar.comments}</Text>
            </View>
        </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <AnimatedHeaderWrapper visible={tabVisible}>
            <TitleBar/>
            <SearchBar managedProps={{text, setText, searchTags, setSearchTags, setSearch}}/>
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
                ListEmptyComponent={renderEmpty}

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