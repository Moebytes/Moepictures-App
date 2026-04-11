/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useReducer} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSessionSelector, useFlagActions, 
useCommentDialogSelector, useCommentDialogActions, useLayoutActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import functions from "../../functions/Functions"
import MiniTextBox, {MiniTextBoxRef} from "../../ui/MiniTextBox"
import Draggable from "../Draggable"

const EditCommentDialog: React.FunctionComponent = () => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {editCommentID, editCommentText} = useCommentDialogSelector()
    const {setEditCommentID, setEditCommentText} = useCommentDialogActions()
    const {setEmojiStripVisible} = useLayoutActions()
    const {setCommentFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const textBoxRef = useRef<MiniTextBoxRef>(null)

    const onSubmit = async () => {
        if (!editCommentID || !textBoxRef.current) return

        const text = await textBoxRef.current.resolveReplacements()
        const badComment = functions.valid.validateComment(text, i18n)
        if (badComment) {
            textBoxRef.current?.showError(badComment)
            await functions.timeout(2000)
            textBoxRef.current?.clearError()
            return
        }

        await functions.http.put("/api/comment/edit", {commentID: editCommentID, comment: text}, session)
        setCommentFlag(true)
        onClose()
    }

    const onClose = () => {
        setEditCommentID(null)
        setEmojiStripVisible(false)
    }

    const togglePreview = () => {
        textBoxRef.current?.togglePreviewMode()
        setTimeout(() => forceUpdate(), 0)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (editCommentID) {
        const previewMode = textBoxRef.current?.getPreviewMode()

        return (
            <View style={styles.overlay}>
                <Draggable resetKey={editCommentID}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, {backgroundColor: colors.mainColor, 
                        paddingHorizontal: 0}, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.dialogs.editComment.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <MiniTextBox ref={textBoxRef} text={editCommentText} setText={setEditCommentText} opaque={true}/>
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

export default EditCommentDialog