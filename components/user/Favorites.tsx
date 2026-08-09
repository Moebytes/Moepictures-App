/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, FlatList, ListRenderItem} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useCacheActions, useSearchSelector, 
useSearchActions, useFlagActions,
useSessionSelector} from "../../store"
import {useGetFavoritesInfiniteQuery} from "../../api"
import {createStylesheet} from "./styles/Uploads.styles"
import {PostSearch, Post} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"
import ScalableHaptic from "../../ui/ScalableHaptic"
import functions from "../../functions/Functions"

interface Props {
    username: string
}

const Favorites: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setNavigationPosts} = useCacheActions()
    const {setSearch, setSearchTags} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {ratingType} = useSearchSelector()
    const styles = createStylesheet(colors)
    const [refreshKey, setRefreshKey] = useState(0)
    const navigation = useNavigation()

    const infiniteQuery = useGetFavoritesInfiniteQuery(
        {username: props.username, refreshKey,
        rating: functions.post.isR18(ratingType) ? ratingType : "all"}
    )

    let posts = infiniteQuery.data?.pages.flat() ?? []
    posts = functions.post.filterPosts(posts, ratingType, session)

    const titlePress = () => {
        setSearchTags([`favorites:${props.username}`])
        setSearch(`favorites:${props.username}`)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
    }

    const onPress = (post: Post) => {
        if (!posts) return
        setNavigationPosts(functions.post.appendIfNotExists(post, posts))
    }

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <CarouselImage post={item} onPress={onPress}/>
    }

    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(posts?.[0]?.postCount ?? 0)
    if (!posts?.length) return null

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <ScalableHaptic style={styles.headerContainer} scaleFactor={0.97} onPress={titlePress}>
                    <Text style={styles.headerText}>{i18n.sort.favorites}</Text>
                </ScalableHaptic>
                <Text style={styles.labelText}>{totalItems}</Text>
            </View>

            <FlatList 
                horizontal
                data={posts}
                keyExtractor={(item) => item.postID.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={styles.carousel}

                style={{flexGrow: 0}}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
            />
        </View>
    )
}

export default Favorites