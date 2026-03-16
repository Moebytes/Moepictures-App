/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useCallback, useEffect} from "react"
import {Animated, LayoutChangeEvent, View, ViewStyle} from "react-native"
import {useFocusEffect} from "@react-navigation/native"
import {useLayoutSelector, useLayoutActions} from "../../store"

interface Props {
  visible: boolean
  children: React.ReactNode
  style?: ViewStyle
  duration?: number
}

const AnimatedHeaderWrapper: React.FunctionComponent<Props> = (props) => {
    const {headerHeight} = useLayoutSelector()
    const {setHeaderHeight} = useLayoutActions()
    const translateY = useRef(new Animated.Value(0)).current
    const ref = useRef<View>(null)

    const onLayout = (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height
        if (height !== headerHeight) {
            setHeaderHeight(height)
        }
    }

    useFocusEffect(
        useCallback(() => {
            ref.current?.measure((x, y, width, height) => {
                if (height && height !== headerHeight) {
                    setHeaderHeight(height)
                }
            })
        }, [headerHeight])
    )

    useEffect(() => {
        Animated.timing(translateY, {
        toValue: props.visible ? 0 : -headerHeight,
        duration: props.duration ?? 300,
        useNativeDriver: true
        }).start()
    }, [props.visible, headerHeight, props.duration])

    return (
        <Animated.View ref={ref} onLayout={onLayout}
        style={[{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transform: [{translateY}]
            }, props.style]}>
        {props.children}
        </Animated.View>
    )
}

export default AnimatedHeaderWrapper