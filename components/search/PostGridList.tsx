/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useMemo, useState} from "react"
import {FlatList, FlatListProps, View, useWindowDimensions, StyleSheet, ListRenderItem} from "react-native"
import {PostSearch} from "../../types/PostTypes"
import {useSearchSelector} from "../../store"
import functions from "../../functions/Functions"
import GridImage from "../image/GridImage"

type Props = FlatListProps<PostSearch> & {
    ref?: React.Ref<FlatList>
    onPostPress?: () => void
}

const PostGridList = (props: Props) => {
    const {tiling, sizeType} = useSearchSelector()
    const window = useWindowDimensions()
    const [width, setWidth] = useState(window.width)
    const [viewportHeight, setViewportHeight] = useState(window.height)
    const [offset, setOffset] = useState(0)
    const [headerHeight, setHeaderHeight] = useState(0)
    const headerStyle = StyleSheet.flatten(props.ListHeaderComponentStyle)
    const contentStyle = StyleSheet.flatten(props.contentContainerStyle)

    const column = tiling === "column"
    const columns = props.numColumns ?? 1
    const gridWidth = sizeType === "medium" || sizeType === "massive" ? width * 0.9 : width

    const posts = useMemo(() => {
        return Array.from(props.data ?? [])
    }, [props.data])

    const data = useMemo(() => {
        return column ? posts.slice(0, 1) : posts.filter((_, index) => index % columns === 0)
    }, [column, posts, columns])

    const layout = useMemo(() => {
        return functions.image.columnLayout(column ? posts : [], gridWidth, columns)
    }, [column, posts, gridWidth, columns])
    
    const gridTop = headerHeight + (Number(contentStyle?.paddingTop) || 
        Number(contentStyle?.paddingVertical) || 0)
        + (Number(contentStyle?.marginTop) || 0)
        
    const Header = props.ListHeaderComponent
    const header = React.isValidElement(Header) ? Header : Header ? <Header/> : null

    const renderItem: ListRenderItem<PostSearch> = (info) => {
        if (!column) {
            if (columns === 1) return props.renderItem?.(info) ?? null
            const start = info.index * columns
            return (
                <View style={[{flexDirection: "row"}, props.columnWrapperStyle]}>
                    {posts.slice(start, start + columns).map((post, index) => (
                        <React.Fragment key={post.postID}>
                            {props.renderItem?.({...info, item: post, index: start + index})}
                        </React.Fragment>
                    ))}
                </View>
            )
        }

        return (
            <View style={{height: layout.height, width: gridWidth, alignSelf: "center"}}>
                {layout.tiles.filter((tile) => tile.y + tile.height >= offset - gridTop - viewportHeight * 2
                    && tile.y <= offset - gridTop + viewportHeight * 3).map((tile) =>
                    <View key={tile.post.postID} style={{position: "absolute", left: tile.x, top: tile.y,
                        width: tile.width, height: tile.height}}>
                        <GridImage post={tile.post} tileSize={{width: tile.width, height: tile.height}}
                            onPress={props.onPostPress}/>
                    </View>)}
            </View>
        )
    }

    return (
        <FlatList
            {...props}
            ref={props.ref}

            data={data}
            keyExtractor={(_, index) => column ? "column-grid" : `row-${index}`}
            renderItem={renderItem}
            numColumns={1}
            columnWrapperStyle={undefined}

            onLayout={(event) => {
                setWidth(event.nativeEvent.layout.width)
                setViewportHeight(event.nativeEvent.layout.height)
                props.onLayout?.(event)
            }}
            onScroll={(event) => {
                const next = event.nativeEvent.contentOffset.y
                if (Math.abs(next - offset) > viewportHeight / 2) setOffset(next)
                props.onScroll?.(event)
            }}
            scrollEventThrottle={props.scrollEventThrottle ?? 16}
            removeClippedSubviews={column ? false : props.removeClippedSubviews}

            ListHeaderComponent={<View style={headerStyle}
                onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>{header}</View>}
            ListHeaderComponentStyle={undefined}
        />
    )
}

export default PostGridList