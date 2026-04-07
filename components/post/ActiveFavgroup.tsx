/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useCacheActions, useActiveSelector} from "../../store"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostFull, PostOrdered, Post} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
}

const ActiveFavgroup: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {setNavigationPosts} = useCacheActions()
    const {activeFavgroup} = useActiveSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    if (!activeFavgroup) return null

    const onPress = (post: Post) => {
        setNavigationPosts(functions.post.appendIfNotExists(post, activeFavgroup.posts))
    }

    const renderItem: ListRenderItem<PostOrdered> = ({item}) => {
        return <CarouselImage post={item} onPress={onPress}/>
    }

    return (
        <>
        <View style={styles.container} key={activeFavgroup.slug}>
            <Pressable style={styles.headerContainer}
                onPress={() => navigation.navigate("Favgroup", {slug: activeFavgroup.slug})}>
                <Text style={styles.headerText}>{i18n.post.favgroup}: {activeFavgroup.name}</Text>
            </Pressable>

            <FlatList 
                horizontal
                data={activeFavgroup.posts}
                keyExtractor={(item) => item.postID.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={styles.carousel}
            />
        </View>
        </>
    )
}

export default ActiveFavgroup