/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, useEffect} from "react"
import {View, Text, Image, StatusBar, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {RouteProp} from "@react-navigation/native"
import {StackParamList} from "../../App"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector, useSearchSelector, useSessionSelector} from "../../store"
import {useTagHistoryInfiniteQuery, useTagHistoryPageQuery, useGetTagQuery, useGetUserQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import TagHistoryRow from "../../components/history/TagHistoryRow"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/HistoryScreen.styles"
import {TagHistory, PostSearch} from "../../types/Types"
import functions from "../../functions/Functions"

const noresults = require("../../assets/images/noresults.png")

type Props = {
  route: RouteProp<StackParamList, "TagHistory">
}

const TagHistoryScreen: React.FunctionComponent<Props> = ({route}) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {scroll} = useSearchSelector()
    const styles = createStylesheet(colors)
    const [tabVisible, setTabVisible] = useState(true)
    const {handleScroll} = useAutoHideScroll(setTabVisible)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [text, setText] = useState("")
    const [search, setSearch] = useState("")
    const [searchTags, setSearchTags] = useState<string[]>([])
    const {name} = route.params
    const {data: tag} = useGetTagQuery({tag: name}, {skip: !name})
    const {data: user} = useGetUserQuery({username: tag?.creator!}, {skip: !name})
    const [oldestPost, setOldestPost] = useState<PostSearch | null>(null)
    const ref = useRef<FlatList>(null)

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    useEffect(() => {
        const updateOldestPost = async () => {
            if (!tag) return
            const oldestPost = await functions.http.get("/api/search/posts", {query: tag.tag, 
                type: "all", rating: "all", style: "all", sort: "reverse date", limit: 1}, session)
            setOldestPost(oldestPost[0])
        }
        updateOldestPost()
    }, [tag])

    const pageSize = 15

    const infiniteQuery = useTagHistoryInfiniteQuery(
        {tag: name, query: search, refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useTagHistoryPageQuery(
        {tag: name, query: search, 
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    useEffect(() => {
        setRefreshKey((prev) => prev + 1)
        setPage(1)
    }, [session])

    let history = scroll
        ? (infiniteQuery.data?.pages.flat() ?? [])
        : (pageQuery.data ?? [])

    const isLoading = scroll
        ? infiniteQuery.isLoading
        : pageQuery.isLoading

    const refetch = scroll 
        ? infiniteQuery.refetch
        : pageQuery.refetch
            
    if (name && !history.length && tag && user) {
        const historyObject = {...tag} as unknown as TagHistory
        historyObject.date = tag.createDate ?? oldestPost?.uploadDate!
        historyObject.user = {...user}
        historyObject.key = tag.tag
        historyObject.aliases = tag.aliases.map((alias) => alias?.alias || "")
        historyObject.implications = tag.implications.map((implication) => implication?.implication || "")
        historyObject.historyCount = "1"
        history = [historyObject]
    }

    const renderItem: ListRenderItem<TagHistory> = ({item, index}) => {
        const previousHistory = history[index + 1] ?? null

        return <TagHistoryRow history={item} currentHistory={history[0]} previousHistory={previousHistory} index={index} refetch={refetch}/>
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

    const totalItems = Number(pageQuery.data?.[0]?.historyCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    const headerJSX = () => {
        if (isLoading) return null

        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{i18n.history.tag}</Text>
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
                contentContainerStyle={{
                    backgroundColor: colors.background,
                    marginTop: headerHeight,
                    paddingBottom: tabBarHeight
                }}
                data={history} 
                renderItem={renderItem}
                keyExtractor={(item, index) => item.historyID?.toString() || index.toString()}
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

export default TagHistoryScreen