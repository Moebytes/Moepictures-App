/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Text, useWindowDimensions, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/GroupThumbnail.styles"
import functions from "../../functions/Functions"
import FilterImage from "../image/FilterImage"
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
    const navigation = useNavigation()

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
        <Pressable style={(({pressed}) => [styles.container, pressed && {borderColor: colors.borderColor}])}
            onPress={() => navigation.navigate("Group", {slug: props.group.slug})}>
            <View style={styles.imageContainer}>
                <FilterImage img={img} size={size}/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.group.name}</Text>
            </View>
        </Pressable>
    )
}

export default GroupThumbnail