/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, Image, ListRenderItem} from "react-native"
import {useThemeSelector} from "../../store"
import {useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostSearch} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"

interface Props {
    tag?: string
}

const ArtistWorks: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const {data: posts} = useSearchPostsPageQuery(
        {query: props.tag, type: "image", rating: "all", style: "all", sort: "posted", limit: 1000},
        {skip: !Boolean(props.tag)}
    )

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <CarouselImage post={item}/>
    }

    if (!posts?.length) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.post.artistWorks}</Text>
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

export default ArtistWorks