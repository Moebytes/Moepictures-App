/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Text, ImageSourcePropType, useWindowDimensions} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/GroupThumbnail.styles"
import functions from "../../functions/Functions"

interface Props {
    img: ImageSourcePropType
}

const GroupThumbnail: React.FunctionComponent<Props> = (props) => {
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    useEffect(() => {
        const updateSize = async () => {
            const size = await functions.image.dynamicResize(props.img, 200, width)
            setSize(size)
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={size} source={props.img} resizeMode="contain"/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Pixiv 12304234</Text>
            </View>
        </View>
    )
}

export default GroupThumbnail