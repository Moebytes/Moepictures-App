/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem} from "react-native"
import {useThemeSelector} from "../../store"
import {useGetPostChildrenQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostFull, ChildPost} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"

interface Props {
    post?: PostFull
}

const Children: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const {data: posts} = useGetPostChildrenQuery(
        {postID: props.post?.postID ?? ""},
        {skip: !Boolean(props.post?.postID)}
    )

    const renderItem: ListRenderItem<ChildPost> = ({item}) => {
        return <CarouselImage post={item.post}/>
    }

    if (!posts?.length) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.post.childPosts}</Text>
            </View>

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

export default Children