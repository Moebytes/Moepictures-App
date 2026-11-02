/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Text} from "react-native"
import Toast from "react-native-toast-message"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSessionSelector, useGroupDialogActions,
useFlagSelector, useFlagActions, useFilterSelector, useFilterActions,
useNoteModeSelector, useLayoutActions} from "../../store"
import {createStylesheet} from "./styles/PostImageOptions.styles"
import StarIcon from "../../assets/svg/star.svg"
import StarGroupIcon from "../../assets/svg/stargroup.svg"
import InfoIcon from "../../assets/svg/info.svg"
import DownloadIcon from "../../assets/svg/download.svg"
import NotesIcon from "../../assets/svg/notes.svg"
import SliderIcon from "../../assets/svg/slider.svg"
import FiltersIcon from "../../assets/svg/filters.svg"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import {ImageRef} from "../image/FilterImage"
import {PostFull, PostHistory} from "../../types/Types"

interface Props {
    post?: PostFull | PostHistory
    openDrawer?: () => void
    imageRef?: React.RefObject<ImageRef | null>
}

const PostImageOptions: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const noteMode = useNoteModeSelector()
    const {setNoteMode} = useLayoutActions()
    const {session} = useSessionSelector()
    const {setFavgroupID} = useGroupDialogActions()
    const {favgroupFlag} = useFlagSelector()
    const {setFavgroupFlag} = useFlagActions()
    const {showFilters} = useFilterSelector()
    const {setShowFilters} = useFilterActions()
    const [favorited, setFavorited] = useState(false)
    const [favGrouped, setFavGrouped] = useState(false)
    const styles = createStylesheet(colors)

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
        if (!permissions.isPremium(session)) {
            return Toast.show({text1: i18n.toast.premiumRequired})
        }
        setFavgroupID(props.post.postID)
    }

    const imageFilters = () => {
        if (!session.username) {
            return Toast.show({text1: i18n.toast.loginRequired})
        }
        if (!permissions.isPremium(session)) {
            return Toast.show({text1: i18n.toast.premiumRequired})
        }
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
            <ScalableHaptic icon={noteMode ? NotesIcon : SliderIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={() => setNoteMode(!noteMode)}>
                <Text style={styles.text}>{noteMode ? i18n.navbar.notes : i18n.sortbar.type.image}</Text>
            </ScalableHaptic>
            <ScalableHaptic icon={FiltersIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={imageFilters}>
                <Text style={styles.text}>{i18n.filters.filters}</Text>
            </ScalableHaptic>
        </View>
    )
}

export default PostImageOptions