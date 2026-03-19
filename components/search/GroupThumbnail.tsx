/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Text, useWindowDimensions} from "react-native"
import {useThemeSelector, useLayoutSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/GroupThumbnail.styles"
import functions from "../../functions/Functions"
import {GroupSearch} from "../../types/Types"

interface Props {
    group: GroupSearch
}

const GroupThumbnail: React.FunctionComponent<Props> = (props) => {
    const {tablet} = useLayoutSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")

    useEffect(() => {
        if (!props.group) return
        const image = props.group.posts[0].images[0]
        const img = functions.link.getThumbnailLink(image, "medium", session)
        setImg(img)
    }, [props.group])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const imageSize = tablet ? 450 : 200
            const size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    if (!img) return null

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={size} source={{uri: img}} resizeMode="contain"/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.group.name}</Text>
            </View>
        </View>
    )
}

export default GroupThumbnail