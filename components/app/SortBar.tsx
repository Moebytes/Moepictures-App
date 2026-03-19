/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Pressable} from "react-native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useThemeSelector, useSearchSelector, useSearchActions} from "../../store"
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

const SortBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const {scroll} = useSearchSelector()
    const {setScroll} = useSearchActions()

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    return (
        <LiquidGlassView interactive effect="clear" tintColor={colors.glassTint} style={[styles.container, fallback]}>
            <View style={styles.iconContainer}>
                <Pressable>
                    <RandomIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <ImgUploadIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <AutoSearchIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <BookmarkIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <HeartIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.iconContainer}>
                <Pressable onPress={() => setScroll(!scroll)}>
                    {scroll ?
                    <ScrollIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                    <PagesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                </Pressable>
                <Pressable>
                    <SquareIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <FiltersIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <SizeIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <SortIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
        </LiquidGlassView>
    )
}

export default SortBar