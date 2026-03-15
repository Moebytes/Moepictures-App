/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {Pressable, Image, ImageSourcePropType, useWindowDimensions} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"

interface Props {
    img: ImageSourcePropType
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    useEffect(() => {
        const updateSize = async () => {
            const size = await functions.image.dynamicResize(props.img, 200, width)
            setSize(size)
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    const borderWidth = 1.2
    const landscape = size.width > size.height
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <Pressable style={[styles.container, size, {borderWidth}]} onPress={() => navigation.navigate("Post")}>
            <Image style={imageSize} source={props.img} resizeMode="contain"/>
        </Pressable>
    )
}

export default GridImage