/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, useEffect} from "react"
import {View, Text, Image, StatusBar, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {useAutoHideScroll} from "../../components/app/useAutoHideScroll"
import {useThemeSelector, useLayoutSelector, useSearchSelector, useSessionSelector} from "../../store"
import {useSearchGroupsInfiniteQuery, useSearchGroupsPageQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import SearchBar from "../../components/app/SearchBar"
import TabBar from "../../components/app/TabBar"
import GroupThumbnail from "../../components/search/GroupThumbnail"
import PageButtons from "../../components/search/PageButtons"
import AnimatedHeaderWrapper from "../../components/app/AnimatedHeaderWrapper"
import {createStylesheet} from "./styles/CommentsScreen.styles"
import {GroupSearch} from "../../types/Types"
import functions from "../../functions/Functions"

const noresults = require("../../assets/images/noresults.png")

const GroupsScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {scroll, ratingType, groupSort} = useSearchSelector()
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

    const infiniteQuery = useSearchGroupsInfiniteQuery(
        {query: search, sort: groupSort, refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useSearchGroupsPageQuery(
        {query: search, sort: groupSort, 
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    const filterGroups = (groups: GroupSearch[]) => {
        let filtered = [] as GroupSearch[]
        for (const group of groups) {
            if (group.posts[0].type !== "image" && group.posts[0].type !== "comic") continue
            if (!session.username) if (group.rating !== functions.r13()) continue
            if (!session.username) if (group.posts[0].rating !== functions.r13()) continue
            if (!functions.post.isR18(ratingType)) if (functions.post.isR18(group.rating)) continue
            filtered.push(group)
        }
        return filtered
    }

    const groups = scroll
        ? filterGroups((infiniteQuery.data?.pages.flat() ?? []))
        : filterGroups((pageQuery.data ?? []))

        
    const isLoading = scroll
        ? infiniteQuery.isLoading
        : pageQuery.isLoading

    const renderItem: ListRenderItem<GroupSearch> = ({item}) => {
        return <GroupThumbnail group={item}/>
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

    const totalItems = Number(pageQuery.data?.[0]?.groupCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    const headerJSX = () => {
        if (isLoading) return null

        return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{i18n.sort.groups}</Text>
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
                data={groups} 
                renderItem={renderItem}
                keyExtractor={(item) => item.groupID.toString()}
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-evenly", gap: 5, marginBottom: 5}}

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

export default GroupsScreen