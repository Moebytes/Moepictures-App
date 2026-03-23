/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem} from "react-native"
import {useThemeSelector} from "../../store"
import {useGetPostParentQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostFull, ChildPost} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"

interface Props {
    post?: PostFull
}

const Parent: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const {data: post} = useGetPostParentQuery(
        {postID: props.post?.postID ?? ""},
        {skip: !Boolean(props.post?.postID)}
    )

    const renderItem: ListRenderItem<ChildPost> = ({item}) => {
        return <CarouselImage post={item.post}/>
    }

    if (!post) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.post.parentPost}</Text>
            </View>

            <FlatList 
                horizontal
                data={[post]}
                keyExtractor={(item) => item.postID.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={styles.carousel}
            />
        </View>
    )
}

export default Parent