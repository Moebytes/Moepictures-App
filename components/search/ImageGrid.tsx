/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useEffectEvent, useRef} from "react"
import {View, Image, FlatList, ListRenderItem, RefreshControl, 
NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {useThemeSelector, useLayoutSelector, useSearchSelector, useFlagSelector,
useFlagActions, useSessionSelector, useSearchActions} from "../../store"
import {createStylesheet} from "./styles/ImageGrid.styles"
import GridImage from "../image/GridImage"
import PageButtons from "./PageButtons"
import {useAutoHideScroll} from "../app/useAutoHideScroll"
import {useSearchPostsInfiniteQuery, useSearchPostsPageQuery} from "../../api"
import {PostSearch} from "../../types/PostTypes"
import functions from "../../functions/Functions"

const noresults = require("../../assets/images/noresults.png")

interface Props {
    onScrollChange?: (visible: boolean) => void
}

const ImageGrid: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {tablet, headerHeight, tabBarHeight} = useLayoutSelector()
    const {imageSearchFlag, randomSearchFlag} = useFlagSelector()
    const {setImageSearchFlag, setRandomSearchFlag} = useFlagActions()
    const {search, scroll, ratingType, styleType, showChildren, sortType, 
    sortReverse, sizeType, square, pageMultiplier, autoScroll, autoSearch} = useSearchSelector()
    const {setAutoScroll} = useSearchActions()
    const styles = createStylesheet(colors)
    const {handleScroll} = useAutoHideScroll(props.onScrollChange)
    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [randomPosts, setRandomPosts] = useState<PostSearch[]>([])
    const ref = useRef<FlatList>(null)
    const scrollOffsetRef = useRef(0)
    const autoSearchRef = useRef<NodeJS.Timeout | null>(null)
    const searchingRef = useRef(false)

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0, animated: true})
    }, [page])

    useEffect(() => {
        let frame: number

        const step = () => {
            ref.current?.scrollToOffset({
                offset: scrollOffsetRef.current + 1,
                animated: false
            })
            frame = requestAnimationFrame(step)
        }

        if (autoScroll) {
            frame = requestAnimationFrame(step)
        }

        return () => cancelAnimationFrame(frame)
    }, [autoScroll])

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y
        handleScroll(event)
    }

    const stopAutoScroll = () => {
        if (autoScroll) setAutoScroll(false)
    }

    const pageSize = 15 * pageMultiplier

    const sort = functions.valid.parseSort(sortType, sortReverse)
    const {columns} = functions.image.getImageSize(sizeType, square, tablet)

    const reverseSearch = imageSearchFlag !== null
    const randomSearch = randomPosts.length > 0

    const infiniteQuery = useSearchPostsInfiniteQuery(
        {query: search, type: "image", rating: ratingType, style: styleType, sort, showChildren, refreshKey},
        {skip: !scroll || reverseSearch || randomSearch}
    )

    const pageQuery = useSearchPostsPageQuery(
        {query: search, type: "image", rating: ratingType, style: styleType, sort, showChildren,
        offset: (page - 1) * pageSize, limit: pageSize, refreshKey},
        {skip: scroll || reverseSearch || randomSearch}
    )

    let posts = reverseSearch ? imageSearchFlag :
        randomSearch ? randomPosts :
        scroll ? (infiniteQuery.data?.pages.flat() ?? [])
        : (pageQuery.data ?? [])

    const filterPosts = (posts: PostSearch[]) => {
        let filtered = [] as PostSearch[]
        for (const post of posts) {
            if (post.type !== "image" && post.type !== "comic") continue
            if (!session.username) if (post.rating !== functions.r13()) continue
            if (!functions.post.isR18(ratingType)) if (functions.post.isR18(post.rating)) continue
            filtered.push(post)
        }
        return filtered
    }

    posts = filterPosts(posts)

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
        if (randomSearch) {
            if (!scroll) return
            return getRandomPosts()
        }

        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const onRefresh = () => {
        setImageSearchFlag(null)
        setRandomPosts([])
        setRefreshKey(prev => prev + 1)
    }

    useEffect(() => {
        setImageSearchFlag(null)
        setRandomPosts([])
    }, [search, sort])

    const getRandomPosts = useEffectEvent(async (reset?: boolean) => {
        const result = await functions.http.get("/api/search/posts", {query: search, type: "image", 
            rating: ratingType, style: styleType, showChildren,
            sort: "random", limit: scroll ? 15 : pageSize}, session)
        setRandomPosts((prev) => reset || !scroll ? result : [...prev, ...result])
    })

    useEffect(() => {
        if (randomSearchFlag) {
            setImageSearchFlag(null)
            getRandomPosts(true)
            setRandomSearchFlag(false)
        }
    }, [randomSearchFlag])

    useEffect(() => {
        if (!randomSearch) return
        if (scroll) return
        getRandomPosts(true)
    }, [page])


    useEffect(() => {
        if (autoSearchRef.current) {
            clearInterval(autoSearchRef.current)
            autoSearchRef.current = null
        }
        if (!autoSearch) return
        setImageSearchFlag(null)
        
        const search = async () => {
            if (searchingRef.current) return
            searchingRef.current = true
            await getRandomPosts(true)
            searchingRef.current = false
        }

        search()
        autoSearchRef.current = setInterval(search, Number(session.autosearchInterval || 5000))
        return () => {
            if (autoSearchRef.current) {
                clearInterval(autoSearchRef.current)
                autoSearchRef.current = null
            }
        }
    }, [autoSearch, search, session.autosearchInterval])

    let totalItems = Number(pageQuery.data?.[0]?.postCount ?? 0)
    if (imageSearchFlag) totalItems = imageSearchFlag.length
    const totalPages = Math.ceil(totalItems / pageSize)

    return (
        <View style={styles.container}>
            <FlatList
                ref={ref}
                key={columns}
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
                numColumns={columns}
                columnWrapperStyle={columns !== 1 ? styles.row : undefined}

                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={colors.iconColor}
                        colors={[colors.iconColor]}
                        progressViewOffset={headerHeight}
                    />}

                onEndReached={scroll ? loadMore : undefined}
                onEndReachedThreshold={scroll ? 0.1 : undefined}
                ListFooterComponent={!scroll ? <PageButtons page={page} setPage={setPage}
                    totalPages={totalPages} marginTop={square ? 10 : 0}/> : undefined}
                ListFooterComponentStyle={!scroll ? styles.footer : undefined}
                ListEmptyComponent={renderEmpty}

                onScroll={onScroll}
                onTouchStart={stopAutoScroll}
                onMomentumScrollBegin={stopAutoScroll}
                scrollEventThrottle={16}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            />
        </View>
    )
}

export default ImageGrid