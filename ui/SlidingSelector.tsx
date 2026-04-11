/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {View, Text, Animated, LayoutChangeEvent} from "react-native"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/SlidingSelector.styles"
import PressableHaptic from "./PressableHaptic"

type Props<T> = {
    data: {name: string, value: T, icon?: React.FunctionComponent<{width: number, height: number, color: string}>}[]
    value: T,
    onChange: (value: T) => void
    inactiveColor?: string
    activeColor?: string
    textColor?: string
    activeTextColor?: string
    iconColor?: string
    activeIconColor?: string
    iconSize?: number
    paddingHorizontal?: number
}

const SlidingSelector = <T,>(props: Props<T>) => {
    let {data, value, onChange, inactiveColor, activeColor, 
        textColor, activeTextColor, iconColor, activeIconColor, 
        paddingHorizontal, iconSize = 20} = props
    const {colors} = useThemeSelector()
    const [buttons, setButtons] = useState<{x: number, width: number}[]>([])
    const translateX = useRef(new Animated.Value(0)).current
    const widthAnim = useRef(new Animated.Value(0)).current
    const styles = createStylesheet(colors)

    inactiveColor = inactiveColor ?? colors.optionInactive
    activeColor = activeColor ?? colors.optionActive
    iconColor = iconColor ?? colors.iconColor
    activeIconColor = activeIconColor ?? colors.white
    textColor = textColor ?? colors.textColor
    activeTextColor = activeTextColor ?? colors.white

    const selectedIndex = data.findIndex(item => item.value === value)
    const hasSelection = selectedIndex !== -1
    const opacity = useRef(new Animated.Value(hasSelection ? 1 : 0)).current

    useEffect(() => {
        const index = data.findIndex((item: any) => item.value === value)

        if (index === -1) {
            return Animated.timing(opacity, {
                toValue: 0,
                duration: 120,
                useNativeDriver: false
            }).start()
        }

        const button = buttons[index]
        if (!button) return

        // @ts-ignore
        const hidden = opacity.__getValue() === 0
        if (hidden) {
            translateX.setValue(button.x)
            widthAnim.setValue(button.width)

            return Animated.timing(opacity, {
                toValue: 1,
                duration: 120,
                useNativeDriver: false
            }).start()
        }

        Animated.parallel([
            Animated.spring(translateX, {
                toValue: button.x,
                stiffness: 150,
                damping: 12,
                mass: 0.5,
                useNativeDriver: false
            }),
            Animated.spring(widthAnim, {
                toValue: button.width,
                stiffness: 150,
                damping: 12,
                mass: 0.5,
                useNativeDriver: false
            })
        ]).start()
    }, [value, buttons])

    const generateJSX = () => {
        let jsx = [] as React.ReactElement[]

        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const selected = value === item.value
            const Icon = item.icon

            const onLayout = (event: LayoutChangeEvent) => {
                const {x, width} = event.nativeEvent.layout
                setButtons((prev) => {
                    const copy = [...prev]
                    copy[i] = {x, width}
                    return copy
                })
            }

            jsx.push(
                <PressableHaptic
                    key={item.value as any}
                    onPress={() => onChange(item.value)}
                    onLayout={onLayout}
                    style={[styles.button, {paddingHorizontal: paddingHorizontal ?? 17}]}>
                    {Icon && <Icon width={iconSize} height={iconSize} color={selected ? activeIconColor : iconColor}/>}
                    <Text style={[styles.buttonText, {color: selected ? activeTextColor : textColor}]}>
                        {item.name}
                    </Text>
                </PressableHaptic>
            )
        }

        return jsx
    }

    return (
        <View style={[styles.buttonContainer, {backgroundColor: inactiveColor}]}>
            <Animated.View style={{...styles.slider,
                backgroundColor: activeColor,
                transform: [{translateX}],
                width: widthAnim,
                opacity
            }}/>

            {generateJSX()}
        </View>
    )
}

export default SlidingSelector