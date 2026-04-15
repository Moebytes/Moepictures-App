/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useState, useEffect} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput, Keyboard} from "react-native"
import Toast from "react-native-toast-message"
import {useInvalidatePost} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSessionSelector, usePostDialogSelector, usePostDialogActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import Draggable from "../Draggable"

const ParentDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {childPostObj} = usePostDialogSelector()
    const {setChildPostObj} = usePostDialogActions()
    const [parentID, setParentID] = useState("")
    const [reason, setReason] = useState("")
    const [error, setError] = useState("")
    const styles = createStylesheet(colors)
    const textRef = useRef<TextInput>(null)
    const invalidatePost = useInvalidatePost()

    useEffect(() => {
        if (childPostObj) {
            setParentID(childPostObj.parentID || "")
        } else {
            setParentID("")
        }
    }, [childPostObj])

    const onSubmit = async () => {
        if (!childPostObj) return
        if (permissions.isContributor(session)) {
            const data = {
                postID: childPostObj.postID,
                type: childPostObj.type,
                rating: childPostObj.rating,
                style: childPostObj.style,
                parentID
            }
            await functions.http.put("/api/post/quickedit", data, session)
            invalidatePost(childPostObj.postID)
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) {
                setError(badReason)
                await functions.timeout(2000)
                return setError("")
            }
            const data = {
                postID: childPostObj.postID,
                type: childPostObj.type,
                rating: childPostObj.rating,
                style: childPostObj.style,
                parentID,
                reason
            }
            await functions.http.put("/api/post/quickedit/unverified", data, session)
            Toast.show({text1: i18n.dialogs.group.submitText})
        }
        onClose()
    }

    const onClose = () => {
        setChildPostObj(null)
        setReason("")
        Keyboard.dismiss()
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let hasPermission = permissions.isContributor(session)

    if (childPostObj) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={childPostObj.postID}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            {hasPermission ? 
                            <Text style={styles.title}>{i18n.sidebar.addParent}</Text> :
                            <Text style={styles.title}>{i18n.dialogs.parent.request}</Text>}
                        </View>
                        <View style={styles.row}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.parentID}:</Text>
                            </View>
                            <TextInput ref={textRef} style={[styles.input, {width: 120}]} 
                                value={parentID} onChangeText={setParentID}
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
                                {hasPermission ? i18n.sort.parent : i18n.buttons.submitRequest}</Text>
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

export default ParentDialog