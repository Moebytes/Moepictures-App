/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../ui/colors"
import {fonts} from "../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        popup: {
            position: "absolute",
            zIndex: 2000,
            overflow: "hidden"
        },
        bubble: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.iconColor,
            borderRadius: 6
        },
        bubbleContent: {
            padding: 8
        },
        bubbleText: {
            fontSize: 18,
            color: colors.textColor
        },
        characterBubble: {
            backgroundColor: "transparent"
        },
        characterContent: {
            paddingLeft: 5
        },
        characterText: {
            fontFamily: fonts.irohamaruMikami,
            fontSize: 16,
            color: "#f52a9c"
        }
    })
}