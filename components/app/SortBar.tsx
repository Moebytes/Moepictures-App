/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View} from "react-native"
import IconButton from "../../ui/IconButton"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useThemeSelector, useSearchSelector, useSearchActions, 
useSearchDialogActions, useSearchDialogSelector} from "../../store"
import {createStylesheet} from "./styles/SortBar.styles"
import RandomIcon from "../../assets/svg/random.svg"
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

const SortBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const {scroll, square, sortReverse} = useSearchSelector()
    const {setScroll, setSquare} = useSearchActions()
    const {showSizeDialog, showSortDialog} = useSearchDialogSelector()
    const {setShowSizeDialog, setShowSortDialog} = useSearchDialogActions()

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    return (
        <LiquidGlassView effect="clear" tintColor={colors.glassTint} style={[styles.container, fallback]}>
            <View style={styles.iconContainer}>
                <IconButton icon={RandomIcon} size={iconSize} color={colors.iconColor}/>
                <IconButton icon={ImgUploadIcon} size={iconSize} color={colors.iconColor}/>
                <IconButton icon={AutoSearchIcon} size={iconSize} color={colors.iconColor}/>
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