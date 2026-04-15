/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useReducer} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput, Keyboard} from "react-native"
import Toast from "react-native-toast-message"
import {useInvalidateTags} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSessionSelector, useTagDialogSelector, useTagDialogActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import Draggable from "../Draggable"

const AliasTagDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {aliasTagID} = useTagDialogSelector()
    const {setAliasTagID} = useTagDialogActions()
    const [name, setName] = useState("")
    const [reason, setReason] = useState("")
    const [error, setError] = useState("")
    const styles = createStylesheet(colors)
    const textRef = useRef<TextInput>(null)
    const invalidateTags = useInvalidateTags()

    const onSubmit = async () => {
        if (!aliasTagID) return
        if (permissions.isMod(session)) {
            if (!name) {
                setError(i18n.dialogs.editGroup.noName)
                await functions.timeout(2000)
                return setError("")
            }
            try {
                await functions.http.post("/api/tag/aliasto", {tag: aliasTagID, aliasTo: name}, session)
                invalidateTags()
            } catch {
                setError(i18n.dialogs.editTag.error)
                await functions.timeout(2000)
                return setError("")
            }
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) {
                setError(badReason)
                await functions.timeout(2000)
                return setError("")
            }
            try {
                await functions.http.post("/api/tag/aliasto/request", {tag: aliasTagID, aliasTo: name, reason}, session)
                Toast.show({text1: i18n.dialogs.group.submitText})
            } catch {
                setError(i18n.dialogs.editTag.error)
                await functions.timeout(2000)
                return setError("")
            }
        }
        onClose()
    }

    const onClose = () => {
        setAliasTagID(null)
        setReason("")
        Keyboard.dismiss()
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let hasPermission = permissions.isMod(session)

    if (aliasTagID) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={aliasTagID}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            {hasPermission ? 
                            <Text style={styles.title}>{i18n.dialogs.aliasTag.title}</Text> :
                            <Text style={styles.title}>{i18n.dialogs.aliasTag.request}</Text>}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.italicText}>{i18n.labels.aliasing} {aliasTagID}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.aliasTo}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 120}]} 
                                value={name} onChangeText={setName}
                                selectionColor={colors.borderColor}/>
                        </View>
                        {!hasPermission ? <View style={styles.startRow}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.reason}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 150}]} 
                                value={reason} onChangeText={setReason}
                                selectionColor={colors.borderColor}/>
                        </View> : null}
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
                                {hasPermission ? i18n.buttons.alias : i18n.buttons.submitRequest}</Text>
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

export default AliasTagDialog