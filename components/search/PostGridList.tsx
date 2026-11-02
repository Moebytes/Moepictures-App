/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useMemo, useState, useEffect} from "react"
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
    const gridWidth = sizeType === "medium" || sizeType === "massive" ? width * 0.9 : width

    useEffect(() => {
        setOffset(0)
    }, [tiling])

    const layout = useMemo(() => {
        return functions.image.columnLayout(column ? Array.from(props.data ?? []) : [], gridWidth,
        props.numColumns ?? 1)
    }, [column, props.data, gridWidth, props.numColumns])
    
    const gridTop = headerHeight + (Number(contentStyle?.paddingTop) || 
        Number(contentStyle?.paddingVertical) || 0)
        + (Number(contentStyle?.marginTop) || 0)
        
    const Header = props.ListHeaderComponent
    const header = React.isValidElement(Header) ? Header : Header ? <Header/> : null

    const renderItem: ListRenderItem<PostSearch> = (info) => {
        if (!column) return props.renderItem?.(info) ?? null

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
            key={`${column ? "column" : "row"}-${props.numColumns}`}

            data={column ? props.data?.length ? [props.data[0]] : [] : props.data}
            renderItem={renderItem}
            numColumns={column ? 1 : props.numColumns}
            columnWrapperStyle={column ? undefined : props.columnWrapperStyle}

            onLayout={(event) => {
                setWidth(event.nativeEvent.layout.width)
                setViewportHeight(event.nativeEvent.layout.height)
                props.onLayout?.(event)
            }}
            onScroll={(event) => {
                const next = event.nativeEvent.contentOffset.y
                if (column && Math.abs(next - offset) > viewportHeight / 2) setOffset(next)
                props.onScroll?.(event)
            }}
            scrollEventThrottle={props.scrollEventThrottle ?? 16}
            removeClippedSubviews={column ? false : props.removeClippedSubviews}

            ListHeaderComponent={column ? <View style={headerStyle}
                onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>{header}</View> : Header}
            ListHeaderComponentStyle={column ? undefined : props.ListHeaderComponentStyle}
        />
    )
}

export default PostGridList
