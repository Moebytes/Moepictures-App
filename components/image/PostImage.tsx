/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Pressable, useWindowDimensions, Linking, Share, NativeSyntheticEvent} from "react-native"
import ContextMenu, {ContextMenuOnPressNativeEvent} from "react-native-context-menu-view"
import {useActionSheet} from "@expo/react-native-action-sheet"
import {useIsFocused} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {useThemeSelector, useLayoutSelector, useLayoutActions, useSessionSelector, useFilterSelector,
useMiscDialogActions, useGroupDialogActions, usePostDialogActions} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"
import functions from "../../functions/Functions"
import FilterImage, {ImageRef} from "./FilterImage"
import NoteEditor from "../../modals/NoteEditor"
import {Post, PostHistory, Note, Image as VariantImage} from "../../types/Types"
import {siteURL} from "../../ui/site"
import path from "path"

interface Props {
    post?: Post | PostHistory
    image?: VariantImage | string | null
    imageRef?: React.RefObject<ImageRef | null>
    refreshKey?: string
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet, noteMode} = useLayoutSelector()
    const {setSharingActive, setNoteMode} = useLayoutActions()
    const {setShowFullscreenImage, setShowCropImage, setShowSavePrompt} = useMiscDialogActions()
    const {setGroupPostID} = useGroupDialogActions()
    const {setChildPostObj} = usePostDialogActions()
    const {brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate} = useFilterSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [naturalSize, setNaturalSize] = useState({width: 0, height: 0})
    const [noteData, setNoteData] = useState({key: "", notes: [] as Note[]})
    const {showActionSheetWithOptions} = useActionSheet()
    const isFocused = useIsFocused()

    const imageIndex = props.image ? props.post?.images.findIndex((image) => image === props.image) ?? -1 : -1
    const order = typeof props.image === "object" && props.image ? props.image.order ?? imageIndex + 1 : imageIndex + 1
    const noteKey = `${props.post?.postID || ""}:${order}:${props.refreshKey || ""}`
    const notes = noteData.key === noteKey ? noteData.notes : []

    useEffect(() => {
        if (!isFocused) return
        let cancelled = false
        setNoteMode(false)
        setNoteData({key: noteKey, notes: []})
        const updateNotes = async () => {
            if (!props.post || order < 1) return
            try {
                const result = await functions.http.get("/api/notes", {postID: props.post.postID}, session)
                if (cancelled) return
                const notes = (result || []).filter((note) => note.order === undefined || note.order === order)
                setNoteData({key: noteKey, notes})
                setNoteMode(notes.length > 0)
            } catch {
                if (!cancelled) setNoteMode(false)
            }
        }
        updateNotes()
        return () => {
            cancelled = true
        }
    }, [noteKey, session, isFocused])

    useEffect(() => {
        let cancelled = false
        const updateImage = async () => {
            if (!props.image) return
            const img = await functions.link.resolveImage(props.image, session, false)
            if (!cancelled) setImg(img)
        }
        setImg("")
        setLoaded(false)
        updateImage()
        return () => {
            cancelled = true
        }
    }, [props.image, props.post?.postID])

    useEffect(() => {
        let cancelled = false
        const updateSize = async () => {
            if (!img) return
            let imageSize = tablet ? 1100 : 500
            const [size, naturalSize] = await Promise.all([
                functions.image.dynamicResize({uri: img}, imageSize, width),
                Image.getSize(img)
            ])
            if (cancelled) return
            setSize(size)
            setNaturalSize(naturalSize)
            setLoaded(true)
        }
        updateSize()
        return () => {
            cancelled = true
        }
    }, [img, tablet, width])

    const downloadImage = async () => {
        if (!props.post) return
        if (!await functions.file.requestWritePermission()) return

        let img = await functions.link.resolveImage(props.post.images[0], session, false)
        let filename = decodeURIComponent(path.basename(functions.util.pruneURLParams(img)))

        if (props.imageRef?.current && functions.image.filtersOn({brightness, contrast, hue, 
            saturation, lightness, blur, sharpen, pixelate})) {
            const base64 = props.imageRef.current.toDataURL()
            filename = path.basename(filename, path.extname(filename)) + ".png"
            img = await functions.file.saveBase64Image(base64, filename)
        }

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
    }

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
        } else if (event.nativeEvent.name === i18n.sidebar.addGroup) {
            if (!session.username) {
                return Toast.show({text1: i18n.toast.loginRequired})
            }
            if (!session.emailVerified) {
                return Toast.show({text1: i18n.toast.verificationRequired})
            }
            if (session.banned) {
                return Toast.show({text1: i18n.toast.banned})
            }
            setGroupPostID(props.post.postID)
        } else if (event.nativeEvent.name === i18n.sidebar.addParent) {
            if (!session.username) {
                return Toast.show({text1: i18n.toast.loginRequired})
            }
            if (!session.emailVerified) {
                return Toast.show({text1: i18n.toast.verificationRequired})
            }
            if (session.banned) {
                return Toast.show({text1: i18n.toast.banned})
            }
            setChildPostObj(props.post!)
        } else if (event.nativeEvent.name === i18n.contextMenu.openWebsite) {
            Linking.openURL(`${siteURL}/post/${props.post.postID}/${props.post.slug}`)
        } else if (event.nativeEvent.name === i18n.contextMenu.saveImage) {
            downloadImage()
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
                {title: i18n.sidebar.addGroup, icon: "addgroup"},
                {title: i18n.sidebar.addParent, icon: "parent"},
                {title: i18n.contextMenu.openWebsite, icon: "link"},
                {title: i18n.contextMenu.saveImage, icon: "download"},
                {title: i18n.contextMenu.share, icon: "share"}
            ]}
            onPress={contextMenu}>
                <View style={[styles.container, {opacity: loaded ? 1 : 0}]}>
                    <View style={size}>
                        <Pressable onLongPress={() => null} onPress={() => !noteMode && setShowFullscreenImage(true)}>
                            <FilterImage ref={props.imageRef} img={img} size={size} post={props.post}/>
                        </Pressable>
                        {noteMode && loaded && notes.length > 0 && 
                        <NoteEditor key={noteKey} notes={notes} imageWidth={naturalSize.width} 
                        imageHeight={naturalSize.height} width={size.width} height={size.height}/>}
                    </View>
                </View>
        </ContextMenu>
    )
}

export default PostImage