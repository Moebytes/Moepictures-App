/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, Image, useWindowDimensions, Keyboard} from "react-native"
import {useNavigation, CommonActions} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector, useLayoutSelector, useSearchSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"
import {PostSearch} from "../../types/Types"
import clone from "fast-clone"

interface Props {
    post: PostSearch
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const {tablet, keyboardOpen, dialogOpen} = useLayoutSelector()
    const {sizeType, square} = useSearchSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: width / 2, height: width / 2})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.post) return
        const img = functions.link.getThumbnailLink(props.post.images[0], "medium", session)
        setImg(img)
        setLoaded(false)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const {imageSize} = functions.image.getImageSize(sizeType, square, tablet)
            let size = await functions.image.dynamicResize({uri: img}, imageSize, width)

            if (square) {
                size = {width: imageSize, height: imageSize}
            }
            setSize(size)
            setLoaded(true)
        }
        updateSize()
    }, [img, tablet, sizeType, square])

    const onPress = () => {
        if (dialogOpen) return
        if (keyboardOpen) return Keyboard.dismiss()

        const state = navigation.getState()!

        const routes = clone(state.routes) as any
        let lastRoute = routes[routes.length - 1]
        if (lastRoute.name !== "Post") {
            return navigation.navigate("Post", {postID: props.post.postID})
        }

        const newRoute = {
            name: "Post",
            params: {postID: props.post.postID},
            key: lastRoute.key
        }

        routes[routes.length - 1].key = `Post-${Date.now()}`

        navigation.dispatch(
            CommonActions.reset({
                index: state.routes.length,
                routes: [...routes, newRoute]
            })
        )
    }

    const borderWidth = square ? 0 : 1.2
    const landscape = size.width > size.height
    const marginVertical = square ? 0 :
        sizeType === "large" || sizeType === "massive" ? 10 : 5
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <Pressable style={[styles.container, size,
            {marginVertical, opacity: loaded ? 1 : 0, borderWidth: loaded ? borderWidth : 0}]} 
            onPress={onPress}>

            {!loaded && <View style={{position: "absolute", width: "100%", height: "100%"}}/>}

            {img && <Image style={imageSize} source={{uri: img}} resizeMode={square ? "cover" : "contain"}/>}
        </Pressable>
    )
}

export default GridImage