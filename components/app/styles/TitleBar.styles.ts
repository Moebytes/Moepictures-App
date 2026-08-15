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
            backgroundColor: colors.mainColor,
            minHeight: 63,
            gap: 13,
        },
        textContainer: {
            display: "flex",
            flexDirection: "row"
        },
        textA: {
            color: colors.moeTextA,
            fontSize: Platform.OS === "android" ? 45 : 48,
            lineHeight: 53,
            fontFamily: fonts.tsunagiGothicBlack
        },
        textB: {
            color: colors.moeTextB,
            fontSize: Platform.OS === "android" ? 45 : 48,
            lineHeight: 53,
            fontFamily: fonts.tsunagiGothicBlack
        },
        icon: {
            width: Platform.OS === "android" ? 60 : 63,
            height: Platform.OS === "android" ? 60 : 63
        }
    })
}