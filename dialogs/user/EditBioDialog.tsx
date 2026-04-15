/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useReducer, useState, useEffect} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, Keyboard} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSessionSelector, useFlagActions, 
useLayoutActions, useMiscDialogSelector, useMiscDialogActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"
import MiniTextBox, {MiniTextBoxRef} from "../../ui/MiniTextBox"
import Draggable from "../Draggable"

const EditBioDialog: React.FunctionComponent = () => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {showBioDialog} = useMiscDialogSelector()
    const {setShowBioDialog} = useMiscDialogActions()
    const {setEmojiStripVisible} = useLayoutActions()
    const {setSessionFlag} = useFlagActions()
    const [text, setText] = useState("")
    const styles = createStylesheet(colors)
    const textBoxRef = useRef<MiniTextBoxRef>(null)

    useEffect(() => {
        if (showBioDialog) setText(moeText.undoLinkReplacements(session.bio))
    }, [showBioDialog, session])

    const onSubmit = async () => {
        if (!showBioDialog || !textBoxRef.current) return

        const bio = await textBoxRef.current.resolveReplacements()
        const badBio = functions.valid.validateBio(bio, i18n)
        if (badBio) {
            textBoxRef.current?.showError(badBio)
            await functions.timeout(2000)
            textBoxRef.current?.clearError()
            return
        }

        await functions.http.post("/api/user/changebio", {bio}, session)
        setSessionFlag(true)
        onClose()
    }

    const onClose = () => {
        setShowBioDialog(false)
        setEmojiStripVisible(false)
        Keyboard.dismiss()
    }

    const togglePreview = () => {
        textBoxRef.current?.togglePreviewMode()
        setEmojiStripVisible(false)
        setTimeout(() => forceUpdate(), 0)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (showBioDialog) {
        const previewMode = textBoxRef.current?.getPreviewMode()

        return (
            <View style={styles.overlay}>
                <Draggable resetKey={showBioDialog}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, {//backgroundColor: colors.mainColor, 
                        paddingHorizontal: 0}, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.user.editBio}</Text>
                        </View>
                        <View style={styles.row}>
                            <MiniTextBox ref={textBoxRef} text={text} setText={setText} opaque={true}/>
                        </View>
                        <View style={styles.bottomRow}>
                            <PressableHaptic onPress={onClose} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.cancel}</Text>
                            )}
                            </PressableHaptic>

                            <PressableHaptic onPress={togglePreview} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive,
                                {backgroundColor: previewMode ? colors.editColor : colors.previewColor}
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>
                                        {previewMode ? i18n.buttons.unpreview : i18n.buttons.preview}
                                </Text>
                            )}
                            </PressableHaptic>

                            <PressableHaptic onPress={onSubmit} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.edit}</Text>
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

export default EditBioDialog