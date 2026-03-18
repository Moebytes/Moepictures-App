/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions} from "react-native"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"
import functions from "../../functions/Functions"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const {colors} = useThemeSelector()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")

    useEffect(() => {
        if (!props.post) return
        const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
        setImg(img)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 500, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    if (!img) return null

    return (
        <View style={styles.container}>
            <Image style={size} source={{uri: img}} resizeMode="contain"/>
        </View>
    )
}

export default PostImage