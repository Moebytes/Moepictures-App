/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {View, Image, FlatList, ListRenderItem, RefreshControl} from "react-native"
import {useThemeSelector, useLayoutSelector, useSearchSelector} from "../../store"
import {createStylesheet} from "./styles/ImageGrid.styles"
import GridImage from "../image/GridImage"
import PageButtons from "./PageButtons"
import {useAutoHideScroll} from "../app/useAutoHideScroll"
import {useSearchPostsInfiniteQuery, useSearchPostsPageQuery} from "../../api"
import {PostSearch} from "../../types/PostTypes"

const noresults = require("../../assets/images/noresults.png")

interface Props {
    onScrollChange?: (visible: boolean) => void
}

const ImageGrid: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {search, scroll, pageMultiplier} = useSearchSelector()
    const styles = createStylesheet(colors)
    const {handleScroll} = useAutoHideScroll(props.onScrollChange)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const ref = useRef<FlatList>(null)

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    const pageSize = 15 * pageMultiplier

    const infiniteQuery = useSearchPostsInfiniteQuery(
        {query: search, type: "image", refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useSearchPostsPageQuery(
        {query: search, type: "image", 
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    const posts = scroll
        ? (infiniteQuery.data?.pages.flat() ?? [])
        : (pageQuery.data ?? [])

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <GridImage post={item}/>
    }

    const renderEmpty = () => {
        if (isLoading) return null
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                <Image source={noresults} style={{width: 350, height: 350, resizeMode: "contain"}}/>
            </View>
        )
    }

    const isLoading = scroll
        ? infiniteQuery.isLoading
        : pageQuery.isLoading

    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(pageQuery.data?.[0]?.postCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    return (
        <View style={styles.container}>
            <FlatList
                ref={ref}
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    backgroundColor: colors.background,
                    marginTop: headerHeight,
                    paddingBottom: tabBarHeight
                }}
                data={posts} 
                renderItem={renderItem}
                keyExtractor={(item) => item.postID.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}

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
                ListFooterComponent={!scroll ? <PageButtons page={page} 
                    setPage={setPage} totalPages={totalPages}/> : undefined}
                ListFooterComponentStyle={!scroll ? styles.footer : undefined}
                ListEmptyComponent={renderEmpty}

                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            />
        </View>
    )
}

export default ImageGrid