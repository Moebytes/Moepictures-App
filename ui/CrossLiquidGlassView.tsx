/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, ViewProps, StyleProp, ViewStyle, Platform} from "react-native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useSessionSelector} from "../store"
import {ProgressiveBlurView} from "@sbaiahmed1/react-native-blur"

interface CrossLiquidGlassViewProps extends ViewProps {
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
    effect?: "clear" | "regular"
    tintColor?: string
    interactive?: boolean
    showBlur?: boolean
    blurAmount?: number
    blurType?: "light" | "dark" | "xlight" | "extraDark" | "regular" | "prominent"
}

const CrossLiquidGlassView: React.FunctionComponent<CrossLiquidGlassViewProps> = ({children, showBlur = true, ...props}) => {
    const {lowPerformance} = useSessionSelector()
    if (lowPerformance) showBlur = false

    if (Platform.OS === "ios" && isLiquidGlassSupported && !lowPerformance) {
        return (
            <LiquidGlassView 
                {...props}
                effect={props.effect ?? "clear"} 
                tintColor={props.tintColor}
                interactive={props.interactive}
                style={props.style}>
                {children}
            </LiquidGlassView>
        )
    }

    let fallback = showBlur ? 
        undefined : {backgroundColor: "rgba(255,255,255,0.5)"}
    
    return (
        <View {...props} style={[fallback, props.style, {overflow: "hidden"}]}>
            {showBlur && <ProgressiveBlurView
                blurType={props.blurType ?? "light"}
                blurAmount={props.blurAmount ?? 2}
                startOffset={1.0}
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