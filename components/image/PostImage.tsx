/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {Image, Pressable, useWindowDimensions, Linking, Share, NativeSyntheticEvent} from "react-native"
import ContextMenu, {ContextMenuOnPressNativeEvent} from "react-native-context-menu-view"
import Toast from "react-native-toast-message"
import {useThemeSelector, useLayoutSelector, useLayoutActions, useSessionSelector, useMiscDialogActions} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"
import functions from "../../functions/Functions"
import {PostFull, Image as VariantImage} from "../../types/Types"
import {siteURL} from "../../ui/site"

interface Props {
    post?: PostFull
    image?: VariantImage | null
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {setSharingActive} = useLayoutActions()
    const {setShowFullscreenImage, setShowCropImage} = useMiscDialogActions()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!props.image) return
        const img = functions.link.getImageLink(props.image, session.upscaledImages)
        setImg(img)
    }, [props.image])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            let imageSize = tablet ? 1100 : 500
            const size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
            setLoaded(true)
        }
        setLoaded(false)
        updateSize()
    }, [img, tablet])

    const contextMenu = async (event: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
        if (!props.post) return
        if (event.nativeEvent.name === i18n.sidebar.setAvatar) {
            if (!session.username) {
                return Toast.show({text1: i18n.toast.loginRequired})
            }
            if (!session.emailVerified) {
                return Toast.show({text1: i18n.toast.verificationRequired})
            }
            setShowCropImage(true)
        } else if (event.nativeEvent.name === i18n.contextMenu.openWebsite) {
            Linking.openURL(`${siteURL}/post/${props.post.postID}/${props.post.slug}`)
        } else if (event.nativeEvent.name === i18n.contextMenu.share) {
            const url = `${siteURL}/post/${props.post.postID}/${props.post.slug}`

            let title = props.post.englishTitle || props.post.title || "Post"
            setSharingActive(true)
            try {
                await Share.share({message: url, title})
            } finally {
                setSharingActive(false)
            }
        }
    }

    if (!img) return null

    return (
        <ContextMenu disableShadow borderRadius={0} previewBackgroundColor="transparent"
            actions={[
                {title: i18n.sidebar.setAvatar, icon: "setavatar"},
                {title: i18n.contextMenu.openWebsite, icon: "link"},
                {title: i18n.contextMenu.share, icon: "share"}
            ]}
            onPress={contextMenu}>
                <Pressable style={[styles.container, {opacity: loaded ? 1 : 0}]}
                    onPress={() => setShowFullscreenImage(true)}>
                    {img && <Image style={size} source={{uri: img}} resizeMode="contain"/>}
                </Pressable>
        </ContextMenu>
    )
}

export default PostImage