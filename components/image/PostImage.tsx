/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions, Linking, Share, NativeSyntheticEvent} from "react-native"
import ContextMenu, {ContextMenuOnPressNativeEvent} from "react-native-context-menu-view"
import {useThemeSelector, useLayoutSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"
import functions from "../../functions/Functions"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!props.post) return
        const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
        setImg(img)
        setLoaded(false)
    }, [props.post])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            let imageSize = tablet ? 1100 : 500
            const size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
            setLoaded(true)
        }
        updateSize()
    }, [img, tablet])

    const contextMenu = async (event: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
        if (!props.post) return
        if (event.nativeEvent.name === i18n.contextMenu.openWebsite) {
            Linking.openURL(`https://moepictures.net/post/${props.post.postID}/${props.post.slug}`)
        } else if (event.nativeEvent.name === i18n.contextMenu.share) {
            const url = `https://moepictures.net/post/${props.post.postID}/${props.post.slug}`

            let title = props.post.englishTitle || props.post.title || "Post"
            await Share.share({message: url, title})
        }
    }

    if (!img) return null

    return (
        <ContextMenu disableShadow borderRadius={0} previewBackgroundColor="transparent"
            actions={[
                {title: i18n.contextMenu.openWebsite},
                {title: i18n.contextMenu.share}
            ]}
            onPress={contextMenu}>
                <View style={[styles.container, {opacity: loaded ? 1 : 0}]}>
                    {img && <Image style={size} source={{uri: img}} resizeMode="contain"/>}
                </View>
        </ContextMenu>
    )
}

export default PostImage