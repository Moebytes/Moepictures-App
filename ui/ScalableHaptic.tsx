/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef} from "react"
import {Pressable, PressableProps, GestureResponderEvent, Animated, StyleProp, ViewStyle} from "react-native"
import ReactNativeHapticFeedback, {HapticFeedbackTypes} from "react-native-haptic-feedback"

interface RenderProps {
    pressed: boolean
    colorAnim: Animated.Value
}

interface Props extends Omit<PressableProps, "children"> {
    children?: React.ReactNode | ((props: RenderProps) => React.ReactNode)
    icon?: React.FunctionComponent<{width: number, height: number, color: string}>
    size?: number
    color?: string
    activeColor?: string
    scaleFactor?: number
    style?: StyleProp<ViewStyle>
    hapticType?: HapticFeedbackTypes
}

const ScalableHaptic: React.FunctionComponent<Props> = ({children, onPressIn, onPressOut, icon: Icon, 
    size, color, activeColor, scaleFactor = 0.85, style, ...props}) => {

    const scale = useRef(new Animated.Value(1)).current
    const colorAnim = useRef(new Animated.Value(0)).current
    size = size ?? 0
    color = color ?? ""

    const animateScale = (toValue: number) => {
        Animated.timing(scale, {
            toValue,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    const animateColor = (toValue: number) => {
        Animated.timing(colorAnim, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start()
    }

    const pressIn = (event: GestureResponderEvent) => {
        animateScale(scaleFactor)
        animateColor(1)
        ReactNativeHapticFeedback.trigger(props.hapticType ?? "impactMedium")
        if (onPressIn) onPressIn(event)
    }

    const pressOut = (event: GestureResponderEvent) => {
        animateScale(1)
        animateColor(0)
        if (onPressOut) onPressOut(event)
    }

    return (
        <Pressable onPressIn={pressIn} onPressOut={pressOut} {...props} hitSlop={10}>
            {({pressed}) => (
                <Animated.View style={[{transform: [{scale}]}, style]}>
                    {Icon ? <Icon width={size} height={size} color={pressed && activeColor ? activeColor : color}/> : null}
                    <>{typeof children === "function" ? children({pressed, colorAnim}) : children}</>
                </Animated.View>
            )}
        </Pressable>
    )
}

export default ScalableHaptic