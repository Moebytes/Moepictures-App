/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, useEffect} from "react"
import {View, Text, Image, StatusBar, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useLayoutSelector, useSearchSelector, useSessionSelector, useCacheActions,
useSearchActions, useFlagActions} from "../../store"
import {useSearchHistoryInfiniteQuery, useSearchHistoryPageQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import SearchHistoryRow from "../../components/history/SearchHistoryRow"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/SearchHistoryScreen.styles"
import {SearchHistory} from "../../types/Types"

const noresults = require("../../assets/images/noresults.png")
const login = require("../../assets/images/login.png")

const SearchHistoryScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {scroll, searchHistorySort} = useSearchSelector()
    const {setSearch: setPostsSearch, setSearchTags: setPostsSearchTags} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {setNavigationPosts} = useCacheActions()
    const styles = createStylesheet(colors)
    const [tabVisible, setTabVisible] = useState(true)
    const {handleScroll} = useAutoHideScroll(setTabVisible)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [text, setText] = useState("")
    const [search, setSearch] = useState("")
    const [searchTags, setSearchTags] = useState<string[]>([])
    const ref = useRef<FlatList>(null)
    const navigation = useNavigation()

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    const pageSize = 15

    const infiniteQuery = useSearchHistoryInfiniteQuery(
        {query: search, sort: searchHistorySort, refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useSearchHistoryPageQuery(
        {query: search, sort: searchHistorySort,
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    useEffect(() => {
        setRefreshKey((prev) => prev + 1)
        setPage(1)
    }, [session])

    const history = scroll
        ? (infiniteQuery.data?.pages.flat() ?? [])
        : (pageQuery.data ?? [])

    const isLoading = scroll
        ? infiniteQuery.isLoading
        : pageQuery.isLoading

    const refetch = scroll 
        ? infiniteQuery.refetch
        : pageQuery.refetch

    const onPress = () => {
        const posts = history.map((h) => h.post)
        if (posts.length) setNavigationPosts(posts)
    }
            
    const renderItem: ListRenderItem<SearchHistory> = ({item}) => {
        return <SearchHistoryRow history={item} onPress={onPress} refetch={refetch}/>
    }

    const renderEmpty = () => {
        if (isLoading) return null

        if (!session.username) {
            return (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                    <Image source={login} style={{width: 350, height: 350, resizeMode: "contain"}}/>
                </View>
            )
        }

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

    const pressAction = () => {
        setPostsSearchTags([`history:${session.username}`])
        setPostsSearch(`history:${session.username}`)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
    }

    const totalItems = Number(pageQuery.data?.[0]?.historyCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    const headerJSX = () => {
        if (isLoading) return null

        return (
            <View style={styles.container}>
                <PressableHaptic style={styles.titleContainer} onPress={pressAction}>
                    <Text style={styles.title}>{i18n.history.search}</Text>
                </PressableHaptic>
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
                data={history} 
                renderItem={renderItem}
                keyExtractor={(item) => item.historyID.toString()}
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

export default SearchHistoryScreen