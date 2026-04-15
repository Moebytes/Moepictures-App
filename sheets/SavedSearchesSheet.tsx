/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef} from "react"
import {View, ScrollView, Text, Image, Animated} from "react-native"
import Alert from "@blazejkustra/react-native-alert"
import {TrueSheet} from "@lodev09/react-native-true-sheet"
import {useThemeSelector, useSheetSelector, useSheetActions, useSessionSelector,
useSearchActions, useFlagActions, useSearchSelector} from "../store"
import ScalableHaptic from "../ui/ScalableHaptic"
import PressableHaptic from "../ui/PressableHaptic"
import {createStylesheet} from "./Sheet.styles"
import EditIcon from "../assets/svg/edit.svg"
import DeleteIcon from "../assets/svg/delete.svg"
import functions from "../functions/Functions"

const noresults = require("../assets/images/noresults.png")

const SavedSearchesSheet: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {showSavedSearchesSheet} = useSheetSelector()
    const {setShowSavedSearchesSheet} = useSheetActions()
    const {search} = useSearchSelector()
    const {setSearch, setSearchTags} = useSearchActions()
    const {setSessionFlag, setSearchScrollFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const sheet = useRef<TrueSheet>(null)

    const savedSearches = session.savedSearches || {}

    useEffect(() => {
        if (showSavedSearchesSheet) {
            sheet.current?.present()

            setShowSavedSearchesSheet(false)
        }
    }, [showSavedSearchesSheet])

    const deleteAll = async () => {
        Alert.alert(i18n.dialogs.deleteAllSaveSearch.title, i18n.dialogs.deleteAllSaveSearch.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.delete("/api/user/savesearch/delete", {all: true}, session)
                sheet.current?.dismiss()
            }}
        ], {cancelable: true})
    }

    const saveSearch = async () => {
        Alert.prompt(i18n.sidebar.saveSearch, i18n.contextMenu.enterSearchTags, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.continue, style: "default", onPress: async (tags?: string) => {
                if (!tags?.trim()) return

                const defaultName = tags.split(/ +/g).map((s: string) => s.split("-")[0]).join(" ")

                Alert.prompt(i18n.sidebar.saveSearch, i18n.contextMenu.enterSearchName, [
                    {text: i18n.buttons.cancel, style: "cancel"},
                    {text: i18n.buttons.save, style: "default", onPress: async (name?: string) => {
                        if (!name?.trim()) return

                        await functions.http.post("/api/user/savesearch", {name, tags}, session)
                        setSessionFlag(true)
                    }}
                ], "plain-text", defaultName)
            }}
        ], "plain-text", search)
    }

    const append = (search: string) => {
        setSearchTags([search])
        setSearch(search)
        setSearchScrollFlag(true)

        sheet.current?.dismiss()
    }

    const editSaveSearch = (name: string, search: string) => {
        Alert.prompt(i18n.dialogs.editSaveSearch.title, i18n.contextMenu.enterNewName, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.continue, style: "default", onPress: async (key?: string) => {
                if (!key?.trim()) return

                Alert.prompt(i18n.dialogs.editSaveSearch.title, i18n.contextMenu.enterNewTags, [
                    {text: i18n.buttons.cancel, style: "cancel"},
                    {text: i18n.buttons.edit, style: "default", onPress: async (tags?: string) => {
                        if (!tags?.trim()) return

                        await functions.http.put("/api/user/savesearch", {name, key, tags}, session)
                        setSessionFlag(true)
                    }}
                ], "plain-text", search)
            }}
        ], "plain-text", name)
    }

    const deleteSaveSearch = (name: string) => {
        Alert.alert(i18n.dialogs.deleteSaveSearch.title, i18n.dialogs.deleteSaveSearch.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.delete("/api/user/savesearch/delete", {name}, session)
                setSessionFlag(true)
            }}
        ], {cancelable: true})
    }

    let iconSize = 22

    const generateSavedSearchJSX = () => {
        let jsx = [] as React.ReactElement[]

        if (!Object.keys(savedSearches).length) return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                <Image source={noresults} style={{width: 350, height: 350, resizeMode: "contain"}}/>
            </View>
        )

        for (let i = 0; i < Object.keys(savedSearches).length; i++) {
            const name = Object.keys(savedSearches)[i]
            const savedSearch = Object.values(savedSearches)[i]

            jsx.push(
                <View style={styles.column} key={savedSearch}>
                    <PressableHaptic style={styles.savedSearch} onPress={() => append(savedSearch)}>
                        <Text style={styles.savedSearchText}>{name}</Text>
                    </PressableHaptic>
                    <PressableHaptic onPress={() => editSaveSearch(name, savedSearch)}>
                        <EditIcon width={iconSize} height={iconSize} color={colors.savedSearchColor}/>
                    </PressableHaptic>
                    <PressableHaptic onPress={() => deleteSaveSearch(name)}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.savedSearchColor}/>
                    </PressableHaptic>
                </View>
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
                    <Text style={styles.mainTitle}>{i18n.options.savedSearches}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: "80%"}} 
                    contentContainerStyle={styles.scrollContainer}>
                    {generateSavedSearchJSX()}
                </ScrollView>
                {Object.keys(savedSearches).length ? <View style={styles.row}>
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
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton2, {backgroundColor: colors.savedSearchColor}]} onPress={() => saveSearch()}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.white, colors.black],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.sidebar.saveSearch}
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

export default SavedSearchesSheet