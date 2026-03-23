/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, Linking, Image, useWindowDimensions, Keyboard, NativeSyntheticEvent, Share} from "react-native"
import {useActionSheet} from "@expo/react-native-action-sheet"
import {useNavigation} from "@react-navigation/native"
import ContextMenu, {ContextMenuOnPressNativeEvent} from "react-native-context-menu-view"
import {useThemeSelector, useSessionSelector, useLayoutSelector, useSearchSelector, useMiscDialogActions} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"
import functions from "../../functions/Functions"
import {PostSearch} from "../../types/Types"
import path from "path"

interface Props {
    post: PostSearch
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet, keyboardOpen, dialogOpen} = useLayoutSelector()
    const {sizeType, square} = useSearchSelector()
    const {setShowSavePrompt} = useMiscDialogActions()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: width / 2, height: width / 2})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)
    const {showActionSheetWithOptions} = useActionSheet()
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
        functions.navigateToPost(props.post.postID, navigation)
    }

    const contextMenu = async (event: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
        if (event.nativeEvent.name === i18n.contextMenu.openWebsite) {
            Linking.openURL(`https://moepictures.net/post/${props.post.postID}/${props.post.slug}`)
        } else if (event.nativeEvent.name === i18n.contextMenu.saveImage) {
            if (!await functions.file.requestStoragePermission()) return
    
            const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
            const filename = decodeURIComponent(path.basename(functions.util.pruneURLParams(img)))

            showActionSheetWithOptions({
                title: i18n.contextMenu.saveLocation,
                options: [i18n.contextMenu.photos, i18n.contextMenu.files, i18n.buttons.cancel],
                cancelButtonIndex: 2,
                tintColor: colors.iconColor,
                cancelButtonTintColor: colors.iconColor,
                userInterfaceStyle: theme
            }, async (selectedIndex) => {
                if (selectedIndex === 0) {
                    await functions.file.saveToCameraRoll(img, filename)
                    setShowSavePrompt(true)
                } else if (selectedIndex === 1) {
                    await functions.file.saveToFiles(img, filename)
                    setShowSavePrompt(true)
                }
            })
        } else if (event.nativeEvent.name === i18n.contextMenu.share) {
            const url = `https://moepictures.net/post/${props.post.postID}/${props.post.slug}`

            let title = props.post.englishTitle || props.post.title || "Post"
            await Share.share({message: url, title})
        }
    }

    const borderWidth = square ? 0.8 : 1.2
    const borderColor = functions.post.borderColor(props.post, colors)
    const landscape = size.width > size.height
    const marginVertical = square ? 0 :
        sizeType === "large" || sizeType === "massive" ? 10 : 5
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <ContextMenu disableShadow borderRadius={0} previewBackgroundColor="transparent"
            actions={[
                {title: i18n.contextMenu.openWebsite},
                {title: i18n.contextMenu.saveImage},
                {title: i18n.contextMenu.share}
            ]}
            onPress={contextMenu}>
            <Pressable style={[styles.container, size,
                {marginVertical, borderColor, opacity: loaded ? 1 : 0, borderWidth: loaded ? borderWidth : 0}]} 
                onPress={onPress}>

                {!loaded && <View style={{position: "absolute", width: "100%", height: "100%"}}/>}

                {img && <Image style={imageSize} source={{uri: img}} resizeMode={square ? "cover" : "contain"}/>}
            </Pressable>
        </ContextMenu>
    )
}

export default GridImage