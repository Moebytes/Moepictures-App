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
        container: {
            display: "flex",
            flexDirection: "column",
            width: "100%"
        },
        summary: {
            backgroundColor: colors.mainColor,
            color: colors.textColor,
            fontWeight: "bold",
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 18,
            lineHeight: 20
        },
        summaryPressed: {
            opacity: 0.85
        },
        details: {
            backgroundColor: colors.mainColor,
            fontFamily: fonts.jkGothicM,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor,
            paddingHorizontal: 10,
            paddingVertical: 6
        }
    })
}