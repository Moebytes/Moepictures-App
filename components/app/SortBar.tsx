/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef} from "react"
import {View, Text, Animated, Easing} from "react-native"
import {useActionSheet} from "@expo/react-native-action-sheet"
import Toast from "react-native-toast-message"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useThemeSelector, useSearchSelector, useSearchActions, useFlagActions,
useSearchDialogActions, useSearchDialogSelector, useSessionSelector, 
useSheetSelector, useSheetActions,
useFilterSelector,
useFilterActions} from "../../store"
import {createStylesheet} from "./styles/SortBar.styles"
import {launchImageLibrary} from "react-native-image-picker"
import {pick, types} from "@react-native-documents/picker"
import {FileSystem as fs} from "react-native-file-access"
import OptionsIcon from "../../assets/svg/options.svg"
import ImgUploadIcon from "../../assets/svg/imgupload.svg"
import AutoSearchIcon from "../../assets/svg/autosearch.svg"
import BookmarkIcon from "../../assets/svg/bookmark.svg"
import HeartIcon from "../../assets/svg/heart.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import FiltersIcon from "../../assets/svg/filters.svg"
import SizeIcon from "../../assets/svg/size.svg"
import SortIcon from "../../assets/svg/sort.svg"
import SortReverseIcon from "../../assets/svg/sort-reverse.svg"
import AutoScrollIcon from "../../assets/svg/autoscroll.svg"
import functions from "../../functions/Functions"

const SortBar: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const {scroll, square, sortReverse, autoSearch, pageMultiplier, autoScroll} = useSearchSelector()
    const {setScroll, setSquare, setAutoSearch, setAutoScroll} = useSearchActions()
    const {setImageSearchFlag} = useFlagActions()
    const {showSizeDialog, showSortDialog, showPageMultiplierDialog} = useSearchDialogSelector()
    const {setShowSizeDialog, setShowSortDialog, setShowPageMultiplierDialog} = useSearchDialogActions()
    const {showPostsSheet, showTagFavoritesSheet, showSavedSearchesSheet} = useSheetSelector()
    const {setShowPostsSheet, setShowTagFavoritesSheet, setShowSavedSearchesSheet} = useSheetActions()
    const {showFilters} = useFilterSelector()
    const {setShowFilters} = useFilterActions()
    const {showActionSheetWithOptions} = useActionSheet()
    const spinValue = useRef(new Animated.Value(0)).current

    const imageSearch = () => {
        showActionSheetWithOptions({
            title: i18n.contextMenu.uploadLocation,
            options: [i18n.contextMenu.photos, i18n.contextMenu.files, i18n.buttons.cancel],
            cancelButtonIndex: 2,
            tintColor: colors.iconColor,
            cancelButtonTintColor: colors.iconColor,
            userInterfaceStyle: theme
        }, async (selectedIndex) => {
            if (selectedIndex === 0) {
                const result = await launchImageLibrary({mediaType: "photo"})
                if (result.assets?.[0]?.uri) {
                    const uri = result.assets[0].uri
                    const buffer = await fetch(uri).then((r) => r.arrayBuffer())
                    const bytes = new Uint8Array(buffer)
                    const similar = await functions.http.post("/api/search/similar", 
                        {bytes: Object.values(bytes), useMD5: false}, session)
                    setImageSearchFlag(similar)
                    if (await fs.exists(uri)) fs.unlink(uri)
                }
            } else if (selectedIndex === 1) {
                const result = await pick({mode: "open", type: [types.images]})
                if (result?.[0]?.uri) {
                    const uri = result[0].uri
                    const buffer = await fetch(uri).then((r) => r.arrayBuffer())
                    const bytes = new Uint8Array(buffer)
                    const similar = await functions.http.post("/api/search/similar", 
                        {bytes: Object.values(bytes), useMD5: false}, session)
                    setImageSearchFlag(similar)
                }
            }
        })
    }

    const savedSearches = () => {
        if (!session.username) {
            return Toast.show({text1: i18n.toast.loginRequired})
        }
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        setShowSavedSearchesSheet(!showSavedSearchesSheet)
    }

    const favoriteTags = () => {
        if (!session.username) {
            return Toast.show({text1: i18n.toast.loginRequired})
        }
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        setShowTagFavoritesSheet(!showTagFavoritesSheet)
    }

    useEffect(() => {
        let animation: Animated.CompositeAnimation
        if (autoSearch) {
            animation = Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            )
            animation.start()
        } else {
            spinValue.stopAnimation()
            spinValue.setValue(0)
        }

        return () => animation?.stop()
    }, [autoSearch])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    return (
        <LiquidGlassView effect="clear" tintColor={colors.glassTint} style={[styles.container, fallback]}>
            <View style={styles.iconContainer}>
                <ScalableHaptic icon={ImgUploadIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => imageSearch()}/>
                <Animated.View style={{transform: [{rotate: spin}]}}>
                    <ScalableHaptic icon={AutoSearchIcon} size={iconSize} color={autoSearch ? colors.iconActive : colors.iconColor}
                        onPress={() => setAutoSearch(!autoSearch)}/>
                </Animated.View>
                <ScalableHaptic icon={OptionsIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowPostsSheet(!showPostsSheet)}/>
                <ScalableHaptic icon={BookmarkIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => savedSearches()}/>
                <ScalableHaptic icon={HeartIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => favoriteTags()}/>
            </View>
            <View style={styles.iconContainer}>
                {scroll ? 
                <ScalableHaptic icon={AutoScrollIcon} size={iconSize-3} color={autoScroll ? colors.iconActive : colors.iconColor}
                    onPress={() => setAutoScroll(!autoScroll)} style={{marginRight: -5}}/> :
                <ScalableHaptic onPress={() => setShowPageMultiplierDialog(!showPageMultiplierDialog)}>
                    <Text style={styles.textButton}>{pageMultiplier}x</Text>
                </ScalableHaptic>}
                <ScalableHaptic icon={scroll ? ScrollIcon : PagesIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setScroll(!scroll)}/>
                <ScalableHaptic icon={SquareIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setSquare(!square)}/>
                <ScalableHaptic icon={FiltersIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowFilters(!showFilters)}/>
                <ScalableHaptic icon={SizeIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowSizeDialog(!showSizeDialog)}/>
                <ScalableHaptic icon={sortReverse ? SortReverseIcon : SortIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowSortDialog(!showSortDialog)}/>
            </View>
        </LiquidGlassView>
    )
}

export default SortBar