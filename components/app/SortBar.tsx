/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View} from "react-native"
import {useActionSheet} from "@expo/react-native-action-sheet"
import IconButton from "../../ui/IconButton"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useThemeSelector, useSearchSelector, useSearchActions, useFlagActions,
useSearchDialogActions, useSearchDialogSelector, useSessionSelector} from "../../store"
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
import functions from "../../functions/Functions"

const SortBar: React.FunctionComponent = () => {
    const {theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const {scroll, square, sortReverse, autoSearch} = useSearchSelector()
    const {setScroll, setSquare, setAutoSearch} = useSearchActions()
    const {setImageSearchFlag, setRandomSearchFlag} = useFlagActions()
    const {showSizeDialog, showSortDialog} = useSearchDialogSelector()
    const {setShowSizeDialog, setShowSortDialog} = useSearchDialogActions()
    const {showActionSheetWithOptions} = useActionSheet()

    const imageSearch = () => {
        showActionSheetWithOptions({
            title: "Pick an upload location",
            options: ["Photos", "Files", "Cancel"],
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

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    return (
        <LiquidGlassView effect="clear" tintColor={colors.glassTint} style={[styles.container, fallback]}>
            <View style={styles.iconContainer}>
                <IconButton icon={ImgUploadIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => imageSearch()}/>
                <IconButton icon={AutoSearchIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setAutoSearch(!autoSearch)}/>
                <IconButton icon={OptionsIcon} size={iconSize} color={colors.iconColor}/>
                <IconButton icon={BookmarkIcon} size={iconSize} color={colors.iconColor}/>
                <IconButton icon={HeartIcon} size={iconSize} color={colors.iconColor}/>
            </View>
            <View style={styles.iconContainer}>
                <IconButton icon={scroll ? ScrollIcon : PagesIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setScroll(!scroll)}/>
                <IconButton icon={SquareIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setSquare(!square)}/>
                <IconButton icon={FiltersIcon} size={iconSize} color={colors.iconColor}/>
                <IconButton icon={SizeIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowSizeDialog(!showSizeDialog)}/>
                <IconButton icon={sortReverse ? SortReverseIcon : SortIcon} size={iconSize} color={colors.iconColor}
                    onPress={() => setShowSortDialog(!showSortDialog)}/>
            </View>
        </LiquidGlassView>
    )
}

export default SortBar