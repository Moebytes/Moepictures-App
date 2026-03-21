/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text} from "react-native"
import {BlurView} from "@react-native-community/blur"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSearchDialogSelector, useSearchDialogActions,
useSearchActions, useSearchSelector} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import {PostSize} from "../../types/Types"
import CheckIcon from "../../assets/svg/check.svg"

const SizeDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showSizeDialog} = useSearchDialogSelector()
    const {setShowSizeDialog} = useSearchDialogActions()
    const {sizeType} = useSearchSelector()
    const {setSizeType} = useSearchActions()
    const styles = createStylesheet(colors)

    const click = (size: PostSize) => {
        setSizeType(size)
        setShowSizeDialog(false)
    }

    const generateOptions = () => {
        let jsx = [] as React.ReactElement[]

        let sizes = ["tiny", "small", "medium", "large", "massive"] as PostSize[]

        for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i]
            const selected = size === sizeType

            jsx.push(
                <PressableHaptic 
                    key={size}
                    hitSlop={{left: 100, right: 100, top: 20, bottom: 20}} 
                    style={styles.rowButton} 
                    onPress={() => click(size)}>
                    {({pressed}) => (
                        <>
                        <BlurView blurAmount={4} blurType="light" style={styles.absolute}
                        reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"/>

                        <View style={[styles.rowContent, pressed && {transform: [{scale: 1.1}]}]}>
                            <Text style={styles.text}>
                                {i18n.sortbar.size[size]}
                            </Text>

                            {selected && (
                                <CheckIcon width={22} height={22} color={colors.black}/>
                            )}
                        </View>
                        </>
                    )}
                </PressableHaptic>
            )
            if (i < sizes.length - 1) jsx.push(
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

    if (showSizeDialog) {
        return (
            <View style={styles.overlay}>
                <LiquidGlassView effect="clear" style={[styles.container, fallback]}>
                    {generateOptions()}
                </LiquidGlassView>
            </View>
        )
    }
}

export default SizeDialog