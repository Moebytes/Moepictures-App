/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions, Keyboard} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector, useLayoutSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"
import {Post} from "../../types/Types"

interface Props {
    post: Post
    onPress?: (post: Post) => void
}

const CarouselImage: React.FunctionComponent<Props> = (props) => {
    const {tablet, keyboardOpen, dialogOpen} = useLayoutSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: width / 2, height: width / 2})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [pressed, setPressed] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.post) return
        const img = functions.link.getThumbnailLink(props.post.images[0], "medium", session)
        setImg(img)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const imageSize = tablet ? 400 : 200
            let size = await functions.image.normalizeHeight({uri: img}, imageSize, width)
            setSize(size)
            setLoaded(true)
        }
        setLoaded(false)
        updateSize()
    }, [img, tablet])

    const onPress = () => {
        setPressed(false)
        if (dialogOpen) return
        if (keyboardOpen) return Keyboard.dismiss()
        functions.navigateToPost(props.post.postID, navigation)
        props.onPress?.(props.post)
    }

    const borderWidth = pressed ? 3 : 0
    const landscape = size.width > size.height
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <PressableHaptic style={[styles.container, size, {opacity: loaded ? 1 : 0, borderWidth}]} 
            onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>

            {!loaded && <View style={{position: "absolute", width: "100%", height: "100%"}}/>}

            {img && <Image style={imageSize} source={{uri: img}} resizeMode="contain"/>}
        </PressableHaptic>
    )
}

export default CarouselImage