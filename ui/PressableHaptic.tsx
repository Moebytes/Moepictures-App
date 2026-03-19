/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {Pressable, PressableProps, GestureResponderEvent} from "react-native"
import ReactNativeHapticFeedback, {HapticFeedbackTypes} from "react-native-haptic-feedback"

interface Props extends PressableProps {
    hapticType?: HapticFeedbackTypes
}

const PressableHaptic: React.FunctionComponent<Props> = ({children, onPressIn, ...props}) => {
    const hapticFeedback = (event: GestureResponderEvent) => {
        ReactNativeHapticFeedback.trigger(props.hapticType ?? "impactMedium")
        if (onPressIn) onPressIn(event)
    }

    return (
        <Pressable onPressIn={hapticFeedback} {...props}>
            {children}
        </Pressable>
    )
}

export default PressableHaptic