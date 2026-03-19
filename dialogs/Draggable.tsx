/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useEffect} from "react"
import {Animated, PanResponder, ViewProps, StyleProp, ViewStyle} from "react-native"

interface Props extends Omit<ViewProps, "children"> {
    children: React.ReactNode | ((panHandlers: ReturnType<PanResponder["create"]>["panHandlers"]) => React.ReactNode)
    style?: StyleProp<ViewStyle>
    resetKey?: any
}

const Draggable: React.FC<Props> = ({children, style, resetKey, ...props}) => {
    const pan = useRef(new Animated.ValueXY()).current

    useEffect(() => {
        pan.setValue({x: 0, y: 0})
        pan.setOffset({x: 0, y: 0})
    }, [resetKey])

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                pan.setOffset({
                    // @ts-ignore
                    x: pan.x._value,
                    // @ts-ignore
                    y: pan.y._value
                })
                pan.setValue({x: 0, y: 0})
            },

            onPanResponderMove: Animated.event(
                [null, {dx: pan.x, dy: pan.y}],
                {useNativeDriver: false}
            ),

            onPanResponderRelease: () => {
                pan.flattenOffset()
            }
        })
    ).current

    return (
        <Animated.View {...props}
            style={[style,
                {transform: [
                    {translateX: pan.x},
                    {translateY: pan.y}
                ]}]}>
            {typeof children === "function"
                ? children(panResponder.panHandlers)
                : children}
        </Animated.View>
    )
}

export default Draggable