/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, ImageSourcePropType, useWindowDimensions} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"
import functions from "../../functions/Functions"

interface Props {
    img: ImageSourcePropType
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const {width} = useWindowDimensions()
    const {colors} = useThemeSelector()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)

    useEffect(() => {
        const updateSize = async () => {
            const size = await functions.image.dynamicResize(props.img, 500, width)
            setSize(size)
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    return (
        <View style={styles.container}>
            <Image style={size} source={props.img} resizeMode="contain"/>
        </View>
    )
}

export default PostImage