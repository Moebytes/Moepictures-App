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
        spoiler: {
            fontFamily: fonts.jkGothicM,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor,
            backgroundColor: colors.textColor
        },
        shown: {
            fontFamily: fonts.jkGothicM,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor,
            backgroundColor: "transparent"
        }
    })
}