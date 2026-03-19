/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef} from "react"
import {Pressable, PressableProps, GestureResponderEvent, Animated, StyleProp, ViewStyle} from "react-native"
import ReactNativeHapticFeedback, {HapticFeedbackTypes} from "react-native-haptic-feedback"

interface Props extends PressableProps {
    icon: React.FunctionComponent<{width: number, height: number, color: string}>
    size: number
    color: string
    activeColor?: string
    scaleFactor?: number
    style?: StyleProp<ViewStyle>
    hapticType?: HapticFeedbackTypes
}

const IconButton: React.FunctionComponent<Props> = ({children, onPressIn, onPressOut, icon: Icon, 
    size, color, activeColor, scaleFactor = 0.85, style, ...props}) => {

    const scale = useRef(new Animated.Value(1)).current

    const animateScale = (toValue: number) => {
        Animated.timing(scale, {
            toValue,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    const pressIn = (event: GestureResponderEvent) => {
        animateScale(scaleFactor)
        ReactNativeHapticFeedback.trigger(props.hapticType ?? "impactMedium")
        if (onPressIn) onPressIn(event)
    }

    const pressOut = (event: GestureResponderEvent) => {
        animateScale(1)
        if (onPressOut) onPressOut(event)
    }

    return (
        <Pressable onPressIn={pressIn} onPressOut={pressOut} {...props} hitSlop={10}>
            {({pressed}) => (
                <Animated.View style={[{transform: [{scale}]}, style]}>
                    <Icon width={size} height={size} color={pressed && activeColor ? activeColor : color}/>
                    <>{children}</>
                </Animated.View>
            )}
        </Pressable>
    )
}

export default IconButton