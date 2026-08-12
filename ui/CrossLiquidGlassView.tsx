/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, ViewProps, StyleProp, ViewStyle} from "react-native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {BlurView} from "@react-native-community/blur"

interface CrossLiquidGlassViewProps extends ViewProps {
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
    effect?: "clear" | "regular" | "none"
    tintColor?: string
    interactive?: boolean
    showBlur?: boolean
    blurAmount?: number
    blurType?: "light" | "dark" | "xlight" | "extraDark" | "regular" | "prominent"
}

const CrossLiquidGlassView: React.FunctionComponent<CrossLiquidGlassViewProps> = ({children, showBlur = true, ...props}) => {
    if (isLiquidGlassSupported) {
        return (
            <LiquidGlassView 
                effect={props.effect ?? "clear"} 
                tintColor={props.tintColor}
                interactive={props.interactive}
                style={props.style} 
                {...props}>
                {children}
            </LiquidGlassView>
        )
    }

    return (
        <View {...props} style={[props.style, {overflow: "hidden"}]}>
            {showBlur && <BlurView
                blurType={props.blurType ?? "light"}
                blurAmount={props.blurAmount ?? 2}
                reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }}/>}
            {children}
        </View>
    )
}

export default CrossLiquidGlassView