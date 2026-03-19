/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useEffectEvent, useState, useRef} from "react"
import {View, Text, RefreshControl, FlatList, ListRenderItem} from "react-native"
import IconButton from "../../ui/IconButton"
import {useThemeSelector, useSearchSelector, useSearchActions} from "../../store"
import {useSearchPostsInfiniteQuery, useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/Related.styles"
import GridImage from "../image/GridImage"
import PageButtons from "../search/PageButtons"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import SizeIcon from "../../assets/svg/size.svg"
import {PostSearch} from "../../types/Types"

interface Props {
    tag?: string
    fallback?: string[]
    post?: PostSearch
}

const Related: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {scroll, pageMultiplier} = useSearchSelector()
    const {setScroll} = useSearchActions()
    const styles = createStylesheet(colors)
    const [fallbackIndex, setFallbackIndex] = React.useState(-1)
    const [activeTag, setActiveTag] = useState(props.tag)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const ref = useRef<FlatList>(null)

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    const pageSize = 15 * pageMultiplier

    const infiniteQuery = useSearchPostsInfiniteQuery(
        {query: activeTag, type: "image", refreshKey},
        {skip: !scroll}
    )

    const pageQuery = useSearchPostsPageQuery(
        {query: activeTag, type: "image", offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll}
    )

    const posts = scroll
        ? (infiniteQuery.data?.pages.flat() ?? [])
        : (pageQuery.data ?? [])

    useEffect(() => {
        updateFallback()
    }, [posts])

    const updateFallback = useEffectEvent(() => {
        if (!posts?.length && props.fallback && fallbackIndex < props.fallback.length - 1) {
            setFallbackIndex((prev) => prev + 1)
        }
    })

    useEffect(() => {
        if (props.fallback && fallbackIndex > -1 && fallbackIndex < props.fallback.length - 1) {
            setActiveTag(props.fallback[fallbackIndex])
        }
    }, [fallbackIndex])

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <GridImage post={item}/>
    }

    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(pageQuery.data?.[0]?.postCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    let iconSize = 22

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Related</Text>
                <IconButton icon={scroll ? ScrollIcon : PagesIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setScroll(!scroll)} style={styles.iconContainer}/>
                <IconButton icon={SquareIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}/>
                <IconButton icon={SizeIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}/>
            </View>
            <View style={styles.imageContainer}>
                <FlatList 
                    ref={ref}
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    data={posts} 
                    renderItem={renderItem}
                    keyExtractor={(item) => item.postID.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}

                    onEndReached={scroll ? loadMore : undefined}
                    onEndReachedThreshold={scroll ? 0.1 : undefined}
                    ListFooterComponent={!scroll ? <PageButtons page={page} 
                        setPage={setPage} totalPages={totalPages} hideEndArrow={true}/> : undefined}
                    ListFooterComponentStyle={!scroll ? styles.footer : undefined}
                />
            </View>
        </View>
    )
}

export default Related