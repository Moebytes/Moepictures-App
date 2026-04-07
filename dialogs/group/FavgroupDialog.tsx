/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput} from "react-native"
import asyncStorage from "@react-native-async-storage/async-storage"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useGroupDialogSelector, useGroupDialogActions, useSessionSelector,
useFlagActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import RadioButtonIcon from "../../assets/svg/radiobutton.svg"
import RadioButtonCheckedIcon from "../../assets/svg/radiobutton-checked.svg"
import LockIcon from "../../assets/svg/lock.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {Favgroup} from "../../types/Types"
import functions from "../../functions/Functions"
import Draggable from "../Draggable"

const FavgroupDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {favgroupID} = useGroupDialogSelector()
    const {setFavgroupID} = useGroupDialogActions()
    const {setFavgroupFlag} = useFlagActions()
    const [name, setName] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [favgroups, setFavgroups] = useState([] as Favgroup[])
    const styles = createStylesheet(colors)
    const textRef = useRef<TextInput>(null)

    const updateFavGroups = async () => {
        if (!favgroupID) return
        const favgroups = await functions.http.get("/api/favgroups", {postID: favgroupID}, session)
        setFavgroups(favgroups)
    }

    useEffect(() => {
        const savedState = async () => {
            const savedFavgroupName = await asyncStorage.getItem("favgroupName")
            if (savedFavgroupName) setName(savedFavgroupName)
            const savedFavgroupPrivacy = await asyncStorage.getItem("favgroupPrivacy")
            if (savedFavgroupPrivacy) setIsPrivate(savedFavgroupPrivacy === "true")
        }
        savedState()
    }, [])

    useEffect(() => {
        asyncStorage.setItem("favgroupName", name)
        asyncStorage.setItem("favgroupPrivacy", String(isPrivate))
    }, [name, isPrivate])

    useEffect(() => {
        updateFavGroups()
    }, [favgroupID])

    const onSubmit = async () => {
        if (!favgroupID) return
        if (name.trim()) {
            await functions.http.post("/api/favgroup/update", {postIDs: [favgroupID], name, isPrivate}, session)
            setFavgroupFlag(true)
        }
        onClose()
    }

    const onClose = () => {
        setFavgroupID(null)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    const favgroupJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!favgroupID) return jsx
        for (let i = 0; i < favgroups.length; i++) {
            const favgroup = favgroups[i]
            const deleteFromFavGroup = async () => {
                await functions.http.delete("/api/favgroup/post/delete", {postID: favgroupID, name: favgroup.name}, session)
                updateFavGroups()
                setFavgroupFlag(true)
            }
            jsx.push(
                <View style={styles.startRow}>
                    {favgroup.private ? <LockIcon width={iconSize} height={iconSize} color={colors.iconColor}/> : null}
                    <Text style={styles.text}>{favgroup.name}</Text>
                    <PressableHaptic onPress={deleteFromFavGroup}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.lockColor}/>
                    </PressableHaptic>
                </View>
            )

        }
        return jsx
    }

    if (favgroupID) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={favgroupID}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.dialogs.favgroup.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.favoriteGroup}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 120}]} 
                                value={name} onChangeText={setName}
                                selectionColor={colors.borderColor}/>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>{i18n.labels.privacy}:</Text>
                            <PressableHaptic style={styles.row} onPress={() => setIsPrivate(false)}>
                                {isPrivate ? 
                                <RadioButtonIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                                <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                                <Text style={styles.text2}>{i18n.labels.public}</Text>
                            </PressableHaptic>
                            <PressableHaptic style={styles.row} onPress={() => setIsPrivate(true)}>
                                {isPrivate ? 
                                <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                                <RadioButtonIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                                <Text style={styles.text2}>{i18n.sort.private}</Text>
                            </PressableHaptic>
                        </View>
                        {favgroupJSX()}
                        <View style={styles.bottomRow}>
                            <PressableHaptic onPress={onClose} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.cancel}</Text>
                            )}
                            </PressableHaptic>

                            <PressableHaptic onPress={onSubmit} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.add}</Text>
                            )}
                            </PressableHaptic>
                        </View>
                    </LiquidGlassView>
                )}</Draggable>
            </View>
        )
    }

    return null
}

export default FavgroupDialog