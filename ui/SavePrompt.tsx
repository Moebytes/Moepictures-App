/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useEffect} from "react"
import {View, Text, Animated} from "react-native"
import {BlurView} from "@react-native-community/blur"
import {useThemeSelector, useMiscDialogSelector, useMiscDialogActions} from "../store"
import {createStylesheet} from "./styles/SavePrompt.styles"
import SaveCheckIcon from "../assets/svg/save-check.svg"

const SavePrompt: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showSavePrompt} = useMiscDialogSelector()
    const {setShowSavePrompt} = useMiscDialogActions()
    const styles = createStylesheet(colors)
    const opacity = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0.9)).current

    useEffect(() => {
        if (showSavePrompt) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true
                    })
                ]),

                Animated.delay(1000),

                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true
                    }),
                    Animated.timing(scale, {
                        toValue: 0.9,
                        duration: 150,
                        useNativeDriver: true
                    })
                ])
            ]).start(() => {
                setShowSavePrompt(false)
            })
        }
    }, [showSavePrompt])

    let iconSize = 40

    if (showSavePrompt) {
        return (
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, {opacity, transform: [{scale}]}]}>
                    <BlurView blurAmount={2} blurType="light" style={styles.absolute}
                    reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"/>
                    <Text style={styles.text}>{i18n.buttons.saved}</Text>
                    <SaveCheckIcon width={iconSize} height={iconSize} color={colors.black}/>
                </Animated.View>
            </View>
        )
    }

    return null
}

export default SavePrompt