/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useCacheSelector, useCacheActions} from "../../store"
import {useGetPostGroupsQuery} from "../../api"
import {createStylesheet} from "./styles/ArtistWorks.styles"
import {PostFull, PostOrdered, Post} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
}

const Groups: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {navigationPosts} = useCacheSelector()
    const {setNavigationPosts} = useCacheActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const {data: groups} = useGetPostGroupsQuery(
        {postID: props.post?.postID ?? ""},
        {skip: !Boolean(props.post?.postID)}
    )

    if (!groups?.length) return null

    const generateGroupJSX = () => {
        let jsx = [] as React.ReactElement[]

        for (const group of groups) {
            const onPress = (post: Post) => {
                setNavigationPosts(functions.post.appendIfNotExists(post, group.posts))
            }

            const renderItem: ListRenderItem<PostOrdered> = ({item}) => {
                return <CarouselImage post={item} onPress={onPress}/>
            }

            jsx.push(
                <View style={styles.container} key={group.slug}>
                    <Pressable style={styles.headerContainer}
                        onPress={() => navigation.navigate("Group", {slug: group.slug})}>
                        <Text style={styles.headerText}>{i18n.labels.group}: {group.name}</Text>
                    </Pressable>

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