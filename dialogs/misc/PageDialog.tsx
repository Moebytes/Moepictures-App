/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useFlagActions, useMiscDialogSelector, useMiscDialogActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import Draggable from "../Draggable"

const PageDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showPageDialog} = useMiscDialogSelector()
    const {setShowPageDialog} = useMiscDialogActions()
    const {setPageFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const [input, setInput] = useState("")
    const textRef = useRef<TextInput>(null)

    const onSubmit = () => {
        let num = parseInt(input)
        if (Number.isNaN(num)) return onClose()
        setPageFlag(num)
        onClose()
    }

    const onClose = () => {
        setInput("")
        setShowPageDialog(false)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (showPageDialog) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={showPageDialog}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.dialogs.page.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}}>
                                <Text style={styles.text}>{i18n.labels.page}:</Text>
                            </View>
                            <TextInput ref={textRef} style={styles.input} keyboardType="numeric" 
                                value={input} onChangeText={setInput}
                                selectionColor={colors.borderColor}/>
                        </View>
                        <View style={styles.row}>
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
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.go}</Text>
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

export default PageDialog