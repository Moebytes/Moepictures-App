/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {View, Text, Pressable, FlatList, ListRenderItem} from "react-native"
import {useThemeSelector} from "../../store"
import {useSearchPostsPageQuery} from "../../api"
import {createStylesheet} from "./styles/Related.styles"
import GridImage from "../image/GridImage"
import PageButtons from "../search/PageButtons"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import SizeIcon from "../../assets/svg/size.svg"
import {PostSearch} from "../../types/Types"

interface Props {
    tag?: string
    fallback?: string[]
    post?: PostSearch
}

const Related: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [fallbackIndex, setFallbackIndex] = React.useState(0)

    const activeTag = props.tag || props.fallback?.[fallbackIndex]

    const {data: posts} = useSearchPostsPageQuery({query: activeTag, type: "image", limit: 20, offset: 0})

    useEffect(() => {
        if (!posts?.length && props.fallback && fallbackIndex < props.fallback.length - 1) {
            setFallbackIndex((i) => i + 1)
        }
    }, [posts, props.fallback, fallbackIndex])

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <GridImage post={item}/>
    }

    let iconSize = 22

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Related</Text>
                <Pressable style={styles.iconContainer}>
                    <PagesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable style={styles.iconContainer}>
                    <SquareIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable style={styles.iconContainer}>
                    <SizeIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.imageContainer}>
                <FlatList 
                    style={{flex: 1}}
                    data={posts} 
                    renderItem={renderItem}
                    keyExtractor={(_, i) => i.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    ListFooterComponent={<PageButtons/>}
                    ListFooterComponentStyle={styles.footer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default Related