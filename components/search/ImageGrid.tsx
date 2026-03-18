/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {View, FlatList, ListRenderItem} from "react-native"
import {useThemeSelector, useLayoutSelector} from "../../store"
import {createStylesheet} from "./styles/ImageGrid.styles"
import GridImage from "../image/GridImage"
import PageButtons from "./PageButtons"
import {useAutoHideScroll} from "../app/useAutoHideScroll"
import {useSearchPostsQuery} from "../../api"
import {PostSearch} from "../../types/PostTypes"

interface Props {
    onScrollChange?: (visible: boolean) => void
}

const ImageGrid: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {handleScroll} = useAutoHideScroll(props.onScrollChange)
    const {data: posts} = useSearchPostsQuery({type: "image", limit: 20, offset: 0})

    useEffect(() => {
        console.log(posts)
    }, [posts])

    const renderItem: ListRenderItem<PostSearch> = ({item}) => {
        return <GridImage post={item}/>
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{backgroundColor: colors.background, 
                paddingTop: headerHeight, paddingBottom: tabBarHeight}}
                data={posts} 
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