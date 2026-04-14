/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/GroupImage.styles"
import functions from "../../functions/Functions"
import FilterImage from "./FilterImage"
import {PostOrdered} from "../../types/Types"

interface Props {
    post: PostOrdered
    onPress?: () => void
}

const GroupImage: React.FunctionComponent<Props> = (props) => {
    const {tablet} = useLayoutSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.post) return
        const image = props.post.images[0]
        const img = functions.link.getThumbnailLink(image, "medium", session)
        setImg(img)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const imageSize = tablet ? 350 : 200
            const size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    const onPress = () => {
        navigation.navigate("Post", {postID: props.post.postID})
        props.onPress?.()
    }

    if (!img) return null

    return (
        <Pressable style={(({pressed}) => [styles.container, pressed && {borderColor: colors.borderColor}])}
            onPress={onPress}>
            <View style={styles.imageContainer}>
                <FilterImage img={img} size={size}/>
            </View>
        </Pressable>
    )
}

export default GroupImage