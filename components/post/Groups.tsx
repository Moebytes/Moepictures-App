/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem} from "react-native"
import {useThemeSelector} from "../../store"
import {useGetPostGroupsQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostFull, PostOrdered} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"

interface Props {
    post?: PostFull
}

const Groups: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const {data: groups} = useGetPostGroupsQuery(
        {postID: props.post?.postID ?? ""},
        {skip: !Boolean(props.post?.postID)}
    )

    const renderItem: ListRenderItem<PostOrdered> = ({item}) => {
        return <CarouselImage post={item}/>
    }

    if (!groups?.length) return null

    const generateGroupJSX = () => {
        let jsx = [] as React.ReactElement[]
        for (const group of groups) {
            jsx.push(
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{i18n.labels.group}: {group.name}</Text>
                    </View>

                    <FlatList 
                        horizontal
                        data={group.posts}
                        keyExtractor={(item) => item.postID.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItem}
                        contentContainerStyle={styles.carousel}
                    />
                </View>
            )
        }
        return jsx
    }

    return (
        <>
        {generateGroupJSX()}
        </>
    )
}

export default Groups