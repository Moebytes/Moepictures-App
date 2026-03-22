/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, Modal, Pressable} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSearchDialogSelector, useSearchDialogActions,
useSearchActions, useSearchSelector} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import CheckIcon from "../../assets/svg/check.svg"

const PageMultiplierDialog: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const {showPageMultiplierDialog} = useSearchDialogSelector()
    const {setShowPageMultiplierDialog} = useSearchDialogActions()
    const {pageMultiplier} = useSearchSelector()
    const {setPageMultiplier} = useSearchActions()
    const styles = createStylesheet(colors)

    const click = (multiplier: number) => {
        setPageMultiplier(multiplier)
        setShowPageMultiplierDialog(false)
    }

    const generateOptions = () => {
        let jsx = [] as React.ReactElement[]

        let numbers = [1, 2, 3, 4, 5]

        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i]
            const selected = num === pageMultiplier

            jsx.push(
                <PressableHaptic 
                    key={num}
                    hitSlop={{left: 100, right: 100, top: 20, bottom: 20}} 
                    style={styles.rowButton} 
                    onPress={() => click(num)}>
                    {({pressed}) => (
                        <>
                        <View style={[styles.rowContent, pressed && {transform: [{scale: 1.1}]}]}>
                            <Text style={styles.text}>
                                {num}x
                            </Text>

                            {selected && (
                                <CheckIcon width={22} height={22} color={colors.black}/>
                            )}
                        </View>
                        </>
                    )}
                </PressableHaptic>
            )
            if (i < numbers.length - 1) jsx.push(
                <View style={styles.row}>
                    <View style={styles.separator}/>
                </View>
            )
        }
        return jsx
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (showPageMultiplierDialog) {
        return (
            <Modal transparent visible={showPageMultiplierDialog} animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setShowPageMultiplierDialog(false)}>
                    <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                        {generateOptions()}
                    </LiquidGlassView>
                </Pressable>
            </Modal>
        )
    }
}

export default PageMultiplierDialog