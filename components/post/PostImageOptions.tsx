/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Text} from "react-native"
import {useActionSheet} from "@expo/react-native-action-sheet"
import Toast from "react-native-toast-message"
import path from "path"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSessionSelector, useMiscDialogActions, useGroupDialogActions,
useFlagSelector, useFlagActions, useFilterSelector, useFilterActions} from "../../store"
import {createStylesheet} from "./styles/PostImageOptions.styles"
import StarIcon from "../../assets/svg/star.svg"
import StarGroupIcon from "../../assets/svg/stargroup.svg"
import InfoIcon from "../../assets/svg/info.svg"
import DownloadIcon from "../../assets/svg/download.svg"
import FiltersIcon from "../../assets/svg/filters.svg"
import functions from "../../functions/Functions"
import {ImageRef} from "../image/FilterImage"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
    openDrawer?: () => void
    imageRef?: React.RefObject<ImageRef | null>
}

const PostImageOptions: React.FunctionComponent<Props> = (props) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setShowSavePrompt} = useMiscDialogActions()
    const {setFavgroupID} = useGroupDialogActions()
    const {favgroupFlag} = useFlagSelector()
    const {setFavgroupFlag} = useFlagActions()
    const {showFilters, brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate} = useFilterSelector()
    const {setShowFilters} = useFilterActions()
    const [favorited, setFavorited] = useState(false)
    const [favGrouped, setFavGrouped] = useState(false)
    const styles = createStylesheet(colors)
    const {showActionSheetWithOptions} = useActionSheet()

    const getFavorite = async () => {
        if (!props.post || !session.username) return
        const favorite = await functions.http.get("/api/favorite", {postID: props.post.postID}, session)
        setFavorited(favorite ? true : false)
    }

    const getFavgroup = async () => {
        if (!props.post || !session.username) return
        const favgroups = await functions.http.get("/api/favgroups", {postID: props.post.postID}, session)
        setFavGrouped(favgroups?.length ? true : false)
    }

    useEffect(() => {
        getFavorite()
        getFavgroup()
    }, [props.post, session])

    useEffect(() => {
        if (favgroupFlag) {
            getFavgroup()
            setFavgroupFlag(false)
        }
    }, [favgroupFlag])

    const favorite = async () => {
        if (!props.post) return
        if (!session.username) {
            return Toast.show({text1: i18n.toast.loginRequired})
        }
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        let value = !favorited
        await functions.http.post("/api/favorite/update", {postID: props.post.postID, favorited: value}, session)
        setFavorited(value)
    }

    const favgroup = () => {
        if (!props.post) return
        if (!session.username) {
            return Toast.show({text1: i18n.toast.loginRequired})
        }
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        setFavgroupID(props.post.postID)
    }

    const downloadImage = async () => {
        if (!props.post) return
        if (!await functions.file.requestStoragePermission()) return

        let img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
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

    const imageFilters = () => {
        setShowFilters(!showFilters)
    }

    let iconSize = 35

    return (
        <View style={styles.container}>
            <ScalableHaptic icon={StarIcon} size={iconSize} color={favorited ? colors.favoriteColor : colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={favorite}>
                <Text style={[styles.text, favorited && {color: colors.favoriteColor}]}>{favorited ? i18n.post.favorited : i18n.post.favorite}</Text>
            </ScalableHaptic>
            <ScalableHaptic icon={StarGroupIcon} size={iconSize} color={favGrouped ? colors.favgroupColor : colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={favgroup}>
                <Text style={[styles.text, favGrouped && {color: colors.favgroupColor}]}>{i18n.post.favgroup}</Text>
            </ScalableHaptic>
            <ScalableHaptic icon={InfoIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={props.openDrawer}>
                    <Text style={styles.text}>{i18n.post.info}</Text>
            </ScalableHaptic>
            <ScalableHaptic icon={DownloadIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={downloadImage}>
                <Text style={styles.text}>{i18n.buttons.download}</Text>
            </ScalableHaptic>
            <ScalableHaptic icon={FiltersIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={imageFilters}>
                <Text style={styles.text}>{i18n.filters.filters}</Text>
            </ScalableHaptic>
        </View>
    )
}

export default PostImageOptions