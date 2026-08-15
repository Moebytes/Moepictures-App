/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet, Platform} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        button: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: Platform.OS === "android" ? 42 : 45,
            height: Platform.OS === "android" ? 42 : 45,
            borderRadius: 12,
            backgroundColor: colors.pageNumFill
        },
        activeButton: {
            backgroundColor: colors.iconActive
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            color: colors.pageNumColor,
            fontSize: 20
        }
    })
}