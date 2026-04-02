/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text} from "react-native"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/Toast.styles"
import ArrowIcon from "../assets/svg/arrow.svg"

type Props = {
    text1?: string
}

const Toast = ({text1}: Props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 17

    return (
        <View style={styles.container}>
            <ArrowIcon width={iconSize} height={iconSize} color={colors.toastColor}/>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{text1}</Text>
            </View>
        </View>
    )
}

export default Toast