/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useEffectEvent, useState} from "react"
import {View, Text, Pressable} from "react-native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSearchSelector, useSearchActions, 
useSearchDialogActions, useSearchDialogSelector,
useSessionSelector} from "../../store"
import {useSearchPostsInfiniteQuery, useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/Related.styles"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import SizeIcon from "../../assets/svg/size.svg"
import {PostFull} from "../../types/Types"
import functions from "../../functions/Functions"

interface Props {
    tag?: string
    fallback?: string[]
    post?: PostFull
}

export const useRelatedItems = (props: Props) => {
    const {showRelated} = useSessionSelector()
    const {scroll, pageMultiplier, ratingType} = useSearchSelector()
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

    let rating = props.post?.rating || (functions.post.isR18(ratingType) ? ratingType : "all")

    let active = props.post ? showRelated : true

    const infiniteQuery = useSearchPostsInfiniteQuery(
        {query: activeTag, type: props.post?.type || "mobile", 
        rating: functions.post.isR18(rating) ? rating : "all", 
        style: functions.post.isSketch(props.post?.style || "all") ? "all+s" : "all",
        refreshKey},
        {skip: !active || !scroll}
    )

    const pageQuery = useSearchPostsPageQuery(
        {query: activeTag, type: props.post?.type || "mobile", 
        rating: functions.post.isR18(rating) ? rating : "all", 
        style: functions.post.isSketch(props.post?.style || "all") ? "all+s" : "all",
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: !active || scroll}
    )

    const posts = !active ? [] : scroll
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
        totalItems,
        totalPages
    }
}

interface RelatedProps {
    count?: number
    pressAction?: () => void
}

const Related: React.FunctionComponent<RelatedProps> = (props) => {
    const {showRelated} = useSessionSelector()
    const {i18n, colors} = useThemeSelector()
    const {scroll, square} = useSearchSelector()
    const {setScroll, setSquare} = useSearchActions()
    const {showSizeDialog} = useSearchDialogSelector()
    const {setShowSizeDialog} = useSearchDialogActions()
    const styles = createStylesheet(colors)

    let iconSize = 22

    if (!showRelated && !props.count) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable onPress={props.pressAction}>
                    <Text style={styles.headerText}>{props.count ? i18n.sort.posts : i18n.post.related}</Text>
                </Pressable>
                {props.count ? <Text style={styles.headerTextAlt}>{props.count}</Text> : null}
                <ScalableHaptic icon={scroll ? ScrollIcon : PagesIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setScroll(!scroll)} style={styles.iconContainer}/>
                <ScalableHaptic icon={SquareIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                    onPress={() => setSquare(!square)}/>
                <ScalableHaptic icon={SizeIcon} size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                    onPress={() => setShowSizeDialog(!showSizeDialog)}/>
            </View>
        </View>
    )
}

export default Related