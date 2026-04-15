/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, ScrollView, Text, Image, Animated} from "react-native"
import Alert from "@blazejkustra/react-native-alert"
import {TrueSheet} from "@lodev09/react-native-true-sheet"
import {LiquidGlassView} from "@callstack/liquid-glass"
import {useThemeSelector, useSheetSelector, useSheetActions, useSessionSelector,
useSearchActions, useFlagActions} from "../store"
import ScalableHaptic from "../ui/ScalableHaptic"
import PressableHaptic from "../ui/PressableHaptic"
import {createStylesheet} from "./Sheet.styles"
import {TagCount} from "../types/Types"
import HeartIcon from "../assets/svg/heart.svg"
import functions from "../functions/Functions"

const noresults = require("../assets/images/noresults.png")

const TagFavoritesSheet: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {showTagFavoritesSheet} = useSheetSelector()
    const {setShowTagFavoritesSheet} = useSheetActions()
    const {setSearch, setSearchTags} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const [favoriteTags, setFavoriteTags] = useState([] as TagCount[])
    const [loaded, setLoaded] = useState(false)
    const styles = createStylesheet(colors)
    const sheet = useRef<TrueSheet>(null)

    const updateFavoriteTags = async () => {
        const favoriteTags = await functions.http.get("/api/tagfavorites", null, session)
        setFavoriteTags(favoriteTags)
        setLoaded(true)
    }

    useEffect(() => {
        if (showTagFavoritesSheet) {
            sheet.current?.present()

            setLoaded(false)
            updateFavoriteTags()
            
            setShowTagFavoritesSheet(false)
        }
    }, [showTagFavoritesSheet])

    const deleteAll = async () => {
        Alert.alert(i18n.dialogs.deleteTagFavorites.title, i18n.dialogs.deleteTagFavorites.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.delete("/api/tagfavorites/delete", null, session)
                sheet.current?.dismiss()
            }}
        ], {cancelable: true})
    }

    const append = (tag: string) => {
        let searchTags = [] as string[]

        if (tag === "all") {
            for (const favoriteTag of favoriteTags) {
                searchTags.push(`+${favoriteTag.tag}`)
            }
        } else {
            searchTags.push(`+${tag}`)
        }

        setSearchTags(searchTags)
        setSearch(searchTags.join(" "))
        setSearchScrollFlag(true)

        sheet.current?.dismiss()
    }

    let iconSize = 20

    const generateTagJSX = () => {
        let jsx = [] as React.ReactElement[]

        if (loaded && !favoriteTags.length) return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                <Image source={noresults} style={{width: 350, height: 350, resizeMode: "contain"}}/>
            </View>
        )

        for (const item of favoriteTags) {
            jsx.push(
                <PressableHaptic key={item.tag} onPress={() => append(item.tag)}>
                    <LiquidGlassView interactive effect="clear" 
                        style={[styles.tag, {backgroundColor: functions.tag.getGlassColor(item, colors)}]}>
                            <HeartIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.tagText}>{item.tag.replace(/-/g, " ")}</Text>
                    </LiquidGlassView>
                </PressableHaptic>
            )
        }
        return jsx
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
                    <Text style={styles.mainTitle}>{i18n.options.tagFavorites}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: "80%"}} 
                    contentContainerStyle={styles.scrollContainer}>
                    {generateTagJSX()}
                </ScrollView>
                {favoriteTags.length ? <View style={styles.row}>
                    <View style={styles.evenContainer}>
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton2, 
                            {backgroundColor: colors.optionReset}]}
                            onPress={deleteAll}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.black, colors.white],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.buttons.deleteAll}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton2, {backgroundColor: colors.favoriteColor}]} onPress={() => append("all")}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.white, colors.black],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.buttons.appendAll}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                    </View>
                </View> : null}
            </View>
        </TrueSheet>
    )
}

export default TagFavoritesSheet