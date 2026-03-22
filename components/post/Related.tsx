/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useEffectEvent, useState} from "react"
import {View, Text} from "react-native"
import IconButton from "../../ui/IconButton"
import {useThemeSelector, useSearchSelector, useSearchActions, 
useSearchDialogActions, useSearchDialogSelector} from "../../store"
import {useSearchPostsInfiniteQuery, useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/Related.styles"
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

export const useRelatedItems = (props: Props) => {
    const {scroll, pageMultiplier} = useSearchSelector()
    const [fallbackIndex, setFallbackIndex] = React.useState(-1)
    const [activeTag, setActiveTag] = useState(props.tag)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        setActiveTag(props.tag)
        setFallbackIndex(-1)
        setPage(1)
        setRefreshKey(prev => prev + 1)
    }, [props.tag])

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
        if (props.fallback && fallbackIndex >= 0 && fallbackIndex < props.fallback.length) {
            setActiveTag(props.fallback[fallbackIndex])
        }
    }, [fallbackIndex])

    const updateFallback = useEffectEvent(() => {
        if (infiniteQuery.isLoading || pageQuery.isLoading) return
        if (!posts?.length && props.fallback && fallbackIndex < props.fallback.length - 1) {
            setFallbackIndex(prev => prev + 1)
        }
    })

    useEffect(() => {
        updateFallback()
    }, [posts])
    
    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(pageQuery.data?.[0]?.postCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
        posts,
        loadMore,
        page,
        setPage,
        totalPages
    }
}

const Related: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {scroll, square} = useSearchSelector()
    const {setScroll, setSquare} = useSearchActions()
    const {showSizeDialog} = useSearchDialogSelector()
    const {setShowSizeDialog} = useSearchDialogActions()
    const styles = createStylesheet(colors)

    let iconSize = 22

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.post.related}</Text>
                <IconButton icon={scroll ? ScrollIcon : PagesIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setScroll(!scroll)} style={styles.iconContainer}/>
                <IconButton icon={SquareIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                    onPress={() => setSquare(!square)}/>
                <IconButton icon={SizeIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                    onPress={() => setShowSizeDialog(!showSizeDialog)}/>
            </View>
        </View>
    )
}

export default Related