/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, Image, useWindowDimensions} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector, useLayoutSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"
import {PostSearch} from "../../types/Types"

interface Props {
    post: PostSearch
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const {tablet} = useLayoutSelector()
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
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const imageSize = tablet ? 500 : 200
            const size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
            setLoaded(true)
        }
        setLoaded(false)
        updateSize()
    }, [img])

    const borderWidth = 1.2
    const landscape = size.width > size.height
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <Pressable style={[styles.container, size, {opacity: loaded ? 1 : 0, borderWidth: loaded ? borderWidth : 0}]} 
            onPress={() => navigation.navigate("Post", {postID: props.post.postID})}>

            {!loaded && <View style={{position: "absolute", width: "100%", height: "100%"}}/>}

            {img && <Image style={imageSize} source={{uri: img}} resizeMode="contain"/>}
        </Pressable>
    )
}

export default GridImage