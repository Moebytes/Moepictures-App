/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors, tablet: boolean) => {
    return StyleSheet.create({
        container: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.mainColor,
            paddingVertical: 10,
            paddingHorizontal: 14,
            gap: tablet ? 40 : 18
        },
        iconContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 12,
            color: colors.textColor
        },
        activeText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 12,
            color: colors.iconColor
        }
    })
}