/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {View, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {useThemeSelector, useSessionSelector, useLayoutSelector} from "../../store"
import {createStylesheet} from "./styles/ImageGrid.styles"
import GridImage from "../image/GridImage"
import PageButtons from "./PageButtons"
import {useAutoHideScroll} from "../app/useAutoHideScroll"
import functions from "../../functions/Functions"

const placeholder1 = require("../../assets/images/placeholder/placeholder1.jpg")
const placeholder2 = require("../../assets/images/placeholder/placeholder2.jpg")
const placeholder3 = require("../../assets/images/placeholder/placeholder3.jpg")
const placeholder4 = require("../../assets/images/placeholder/placeholder4.jpg")
const placeholder5 = require("../../assets/images/placeholder/placeholder5.jpg")
const placeholder6 = require("../../assets/images/placeholder/placeholder6.jpg")

let images = [
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6,
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6,
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6
]

interface Props {
    onScrollChange?: (visible: boolean) => void
}

const ImageGrid: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {handleScroll} = useAutoHideScroll(props.onScrollChange)

    useEffect(() => {
        const fetchItems = async () => {
            const result = await functions.http.get("/api/search/posts", {type: "image"}, session)
            console.log(result)
        }
        fetchItems()
    }, [])

    const renderItem: ListRenderItem<ImageSourcePropType> = ({item}) => {
        return <GridImage img={item}/>
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{backgroundColor: colors.background, 
                paddingTop: headerHeight, paddingBottom: tabBarHeight}}
                data={images} 
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListFooterComponent={<PageButtons/>}
                ListFooterComponentStyle={styles.footer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            />
        </View>
    )
}

export default ImageGrid