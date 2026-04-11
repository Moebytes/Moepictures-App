/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useReducer} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput} from "react-native"
import Toast from "react-native-toast-message"
import {useInvalidatePost, useInvalidateGroup, useInvalidateGroups} from "../../api"
import asyncStorage from "@react-native-async-storage/async-storage"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useGroupDialogSelector, useGroupDialogActions, useSessionSelector} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import DeleteIcon from "../../assets/svg/delete.svg"
import {GroupPosts} from "../../types/Types"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import Draggable from "../Draggable"

const GroupDialog: React.FunctionComponent = () => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {groupPostID} = useGroupDialogSelector()
    const {setGroupPostID} = useGroupDialogActions()
    const [name, setName] = useState("")
    const [groups, setGroups] = useState([] as GroupPosts[])
    const [reason, setReason] = useState("")
    const [removalItems, setRemovalItems] = useState([] as {slug: string, postID: string}[])
    const [error, setError] = useState("")
    const styles = createStylesheet(colors)
    const textRef = useRef<TextInput>(null)
    const invalidatePost = useInvalidatePost()
    const invalidateGroup = useInvalidateGroup()
    const invalidateGroups = useInvalidateGroups()

    const updateGroups = async () => {
        if (!groupPostID) return
        const groups = await functions.http.get("/api/groups", {postID: groupPostID}, session)
        setGroups(groups)
    }

    useEffect(() => {
        const savedState = async () => {
            const savedGroupName = await asyncStorage.getItem("groupName")
            if (savedGroupName) setName(savedGroupName)
        }
        savedState()
    }, [])

    useEffect(() => {
        asyncStorage.setItem("groupName", name)
    }, [name])

    useEffect(() => {
        updateGroups()
        setRemovalItems([])
    }, [groupPostID])

    const onSubmit = async () => {
        if (!groupPostID) return
        if (permissions.isContributor(session)) {
            if (!name) {
                setError(i18n.dialogs.editGroup.noName)
                await functions.timeout(2000)
                return setError("")
            }
            await functions.http.post("/api/group", {postIDs: [groupPostID], name}, session)
            invalidatePost(groupPostID)
            invalidateGroup(functions.post.generateSlug(name))
            invalidateGroups()
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) {
                setError(badReason)
                await functions.timeout(2000)
                return setError("")
            }
            if (removalItems.length) {
                await functions.http.post("/api/group/post/delete/request", {reason, removalItems}, session)
                Toast.show({text1: i18n.dialogs.group.submitText})
            } else {
                if (!name) {
                    setError(i18n.dialogs.editGroup.noName)
                    await functions.timeout(2000)
                    return setError("")
                }
                await functions.http.post("/api/group/request", {postIDs: [groupPostID], name, reason}, session)
                Toast.show({text1: i18n.dialogs.group.submitText})
            }
        }
        onClose()
    }

    const onClose = () => {
        setGroupPostID(null)
        setReason("")
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    const groupJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!groupPostID) return jsx
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i]
            const deleteFromGroup = async () => {
                if (permissions.isContributor(session)) {
                    await functions.http.delete("/api/group/post/delete", {postID: groupPostID, name: group.name}, session)
                    updateGroups()
                    invalidateGroup(group.slug)
                } else {
                    removalItems.push({postID: groupPostID, slug: group.slug})
                    forceUpdate()
                }
            }
            let strikethrough = false
            const item = removalItems.find((item) => item.slug === group.slug)
            if (item) strikethrough = true
            jsx.push(
                <View style={styles.startRow}>
                    <Text style={[styles.text, strikethrough && {textDecorationLine: "line-through", 
                        color: colors.lockColor}]}>{group.name}</Text>
                    <PressableHaptic onPress={deleteFromGroup}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.lockColor}/>
                    </PressableHaptic>
                </View>
            )

        }
        return jsx
    }

    let hasPermission = permissions.isContributor(session)

    if (groupPostID) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={groupPostID}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            {hasPermission ? 
                            <Text style={styles.title}>{i18n.sidebar.addGroup}</Text> :
                            <Text style={styles.title}>{removalItems.length ? i18n.dialogs.group.requestRemove : i18n.dialogs.group.requestAdd}</Text>}
                        </View>
                        <View style={[styles.row, {width: "90%"}]}>
                            <Text style={styles.miniText}>{removalItems.length ? i18n.dialogs.group.removeHeader : i18n.dialogs.group.header}</Text>
                        </View>
                        {!removalItems.length ? <View style={styles.startRow}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.groupName}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 170}]} 
                                value={name} onChangeText={setName}
                                selectionColor={colors.borderColor}/>
                        </View> : null}
                        {!hasPermission ? <View style={styles.startRow}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.reason}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 220}]} 
                                value={reason} onChangeText={setReason}
                                selectionColor={colors.borderColor}/>
                        </View> : null}
                        {groupJSX()}
                        {error ? <View style={styles.row}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View> : null}
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
                                    pressed && styles.buttonTextActive]}>
                                {hasPermission ? i18n.buttons.add : i18n.buttons.submitRequest}</Text>
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

export default GroupDialog