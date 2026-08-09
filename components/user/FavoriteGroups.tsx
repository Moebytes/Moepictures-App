/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ListRenderItem} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useCacheActions} from "../../store"
import {useGetFavoriteGroupsQuery} from "../../api"
import {createStylesheet} from "./styles/Uploads.styles"
import {PostOrdered, Post} from "../../types/Types"
import CarouselImage from "../image/CarouselImage"
import ScalableHaptic from "../../ui/ScalableHaptic"
import functions from "../../functions/Functions"

interface Props {
    username: string
}

const FavoriteGroups: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {setNavigationPosts} = useCacheActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const {data: favgroups} = useGetFavoriteGroupsQuery(
        {username: props.username}
    )

    const generateFavgroupJSX = () => {
        let jsx = [] as React.ReactElement[]

        for (const favgroup of favgroups ?? []) {
            const titlePress = () => {
                navigation.navigate("Favgroup", {username: favgroup.username, slug: favgroup.slug}, {pop: true})
            }

            const onPress = (post: Post) => {
                setNavigationPosts(functions.post.appendIfNotExists(post, favgroup.posts))
            }

            const renderItem: ListRenderItem<PostOrdered> = ({item}) => {
                return <CarouselImage post={item} onPress={onPress}/>
            }

            const totalItems = favgroup?.posts.length ?? 0

            jsx.push(
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <ScalableHaptic style={styles.headerContainer} scaleFactor={0.97} onPress={titlePress}>
                            <Text style={styles.headerText}>{favgroup.name}</Text>
                        </ScalableHaptic>
                        <Text style={styles.labelText}>{totalItems}</Text>
                    </View>

                    <FlatList 
                        horizontal
                        data={favgroup.posts}
                        keyExtractor={(item) => item.postID.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItem}
                        contentContainerStyle={styles.carousel}
                        style={{flexGrow: 0}}
                    />
                </View>
            )
        }
        return jsx
    }

    return (
        <>
        {generateFavgroupJSX()}
        </>
    )
}

export default FavoriteGroups