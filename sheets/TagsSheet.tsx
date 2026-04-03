/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, Text, Animated} from "react-native"
import {TrueSheet} from "@lodev09/react-native-true-sheet"
import {useThemeSelector, useSheetSelector, useSheetActions, useSearchSelector,
useSearchActions} from "../store"
import ScalableHaptic from "../ui/ScalableHaptic"
import SlidingSelector from "../ui/SlidingSelector"
import {createStylesheet} from "./Sheet.styles"

const TagsSheet: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showTagsSheet} = useSheetSelector()
    const {setShowTagsSheet} = useSheetActions()
    const {tagSort, tagType} = useSearchSelector()
    const {setTagSort, setTagType} = useSearchActions()
    const [localSort, setLocalSort] = useState(tagSort)
    const [localType, setLocalType] = useState(tagType)
    const styles = createStylesheet(colors)
    const sheet = useRef<TrueSheet>(null)

    useEffect(() => {
        if (showTagsSheet) {
            sheet.current?.present()

            setLocalSort(tagSort)
            setLocalType(tagType)
            
            setShowTagsSheet(false)
        }
    }, [showTagsSheet])

    const reset = () => {
        setLocalSort("posts")
        setLocalType("all")
    }

    const apply = () => {
        setTagSort(localSort)
        setTagType(localType)

        sheet.current?.dismiss()
    }

    const generateSortButtons = () => {
        let sortOptions = [
            {name: i18n.sort.date, value: "date"},
            {name: i18n.sort.random, value: "random"},
            {name: i18n.sort.alphabetic, value: "alphabetic"},
            {name: i18n.sort.posts, value: "posts"}
        ] as any

        let sortOptions2 = [
            {name: i18n.sort.image, value: "image"},
            {name: i18n.sort.aliases, value: "aliases"},
            {name: i18n.sort.length, value: "length"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={sortOptions}
                    value={localSort}
                    onChange={setLocalSort}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={sortOptions2}
                    value={localSort}
                    onChange={setLocalSort}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            </>
        )
    }

    const generateCategoryButtons = () => {
        let categories = [
            {name: i18n.tag.all, value: "all"},
            {name: i18n.tag.artist, value: "artist"},
            {name: i18n.tag.character, value: "character"},
            {name: i18n.tag.series, value: "series"},
            {name: i18n.tag.meta, value: "meta"}
        ] as any

        let categories2 = [
            {name: i18n.tag.appearance, value: "appearance"},
            {name: i18n.tag.outfit, value: "outfit"},
            {name: i18n.tag.accessory, value: "accessory"},
            {name: i18n.tag.action, value: "action"}
        ] as any

        let categories3 = [
            {name: i18n.tag.scenery, value: "scenery"},
            {name: i18n.tag.tag, value: "tag"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={categories}
                    value={localType}
                    onChange={setLocalType}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={categories2}
                    value={localType}
                    onChange={setLocalType}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={categories3}
                    value={localType}
                    onChange={setLocalType}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            </>
        )
    }

    return (
        <TrueSheet
            ref={sheet}
            detents={[0.85]}
            cornerRadius={30}
            grabber={false}
            backgroundColor={colors.background}
            style={{borderColor: colors.optionActive, borderWidth: 1, borderRadius: 30, height: "100%"}}>
            <View style={styles.container}>
                <View style={styles.centerRow}>
                    <Text style={styles.mainTitle}>{i18n.options.searchOptions}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.options.sort}</Text>
                </View>
                {generateSortButtons()}
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.labels.category}</Text>
                </View>
                {generateCategoryButtons()}
                <View style={styles.row}>
                    <View style={styles.evenContainer}>
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton, 
                            {backgroundColor: colors.optionReset}]}
                            onPress={reset}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.black, colors.white],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.filters.reset}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                        <ScalableHaptic scaleFactor={0.97} style={styles.wideButton} onPress={apply}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.white, colors.black],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.buttons.apply}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                    </View>
                </View>
            </View>
        </TrueSheet>
    )
}

export default TagsSheet