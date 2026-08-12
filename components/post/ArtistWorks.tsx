/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, Image, ListRenderItem} from "react-native"
import {useSessionSelector, useThemeSelector, useSearchActions, useCacheActions, useFlagActions} from "../../store"
import {useNavigation} from "@react-navigation/native"
import {useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostSearch, Post} from "../../types/Types"
import ScalableHaptic from "../../ui/ScalableHaptic"
import CarouselImage from "../image/CarouselImage"
import functions from "../../functions/Functions"

interface Props {
    tag?: string
}

const ArtistWorks: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {showRelated} = useSessionSelector()
    const {setNavigationPosts} = useCacheActions()
    const {setSearch, setSearchTags} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const {data: posts} = useSearchPostsPageQuery(
        {query: props.tag, type: "mobile", rating: "all", style: "all", sort: "posted", limit: 1000},
        {skip: !showRelated || !Boolean(props.tag)}
    )

    const pressAction = () => {
        if (!props.tag) return
        setSearchTags([props.tag])
        setSearch(props.tag)
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

    if (!showRelated || !posts?.length) return null

    return (
        <View style={styles.container}>
            <ScalableHaptic scaleFactor={0.97} style={styles.headerContainer} onPress={pressAction}>
                <Text style={styles.headerText}>{i18n.post.artistWorks}</Text>
            </ScalableHaptic>

            <FlatList 
                horizontal
                data={posts}
                keyExtractor={(item) => item.postID.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={styles.carousel}
            />
        </View>
    )
}

export default ArtistWorks