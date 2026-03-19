/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef} from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, TextInput, Pressable} from "react-native"
import {useThemeSelector, useFlagActions, useMiscDialogSelector, useMiscDialogActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import Draggable from "../Draggable"

const PageDialog: React.FunctionComponent = () => {
    const {showPageDialog} = useMiscDialogSelector()
    const {setShowPageDialog} = useMiscDialogActions()
    const {setPageFlag} = useFlagActions()
    const {colors} = useThemeSelector()
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
                        <View {...panHandlers} style={styles.row}>
                            <Text style={styles.title}>Go To Page</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Page: </Text>
                            <TextInput ref={textRef} style={styles.input} keyboardType="numeric" 
                                value={input} onChangeText={setInput}
                                selectionColor={colors.borderColor}/>
                        </View>
                        <View style={styles.row}>
                            <Pressable onPress={onClose} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>Cancel</Text>
                            )}
                            </Pressable>

                            <Pressable onPress={onSubmit} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>Go</Text>
                            )}
                            </Pressable>
                        </View>
                    </LiquidGlassView>
                )}</Draggable>
            </View>
        )
    }

    return null
}

export default PageDialog