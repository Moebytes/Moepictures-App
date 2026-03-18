/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {Pressable, Image, useWindowDimensions} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"
import {PostSearch} from "../../types/Types"

interface Props {
    post: PostSearch
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const [img, setImg] = useState("")

    useEffect(() => {
        if (!props.post) return
        const img = functions.link.getThumbnailLink(props.post.images[0], "medium", session)
        setImg(img)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 200, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    if (!img) return null

    const borderWidth = 1.2
    const landscape = size.width > size.height
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <Pressable style={[styles.container, size, {borderWidth}]} 
            onPress={() => navigation.navigate("Post", {postID: props.post.postID})}>
            <Image style={imageSize} source={{uri: img}} resizeMode="contain"/>
        </Pressable>
    )
}

export default GridImage