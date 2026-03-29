/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        navContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 14,
            gap: 10
        },
        navTextContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12
        },
        navText: {
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 23,
            lineHeight: 30
        },
        scrollContainer: {
            display: "flex",
            flexDirection: "column"
        },
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 25,
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: colors.background
        },
        boxContainer: {
            display: "flex",
            flexDirection: "column"
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 13
        },
        title: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 27,
            lineHeight: 30,
            color: colors.textColor
        },
        heading: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 17,
            lineHeight: 22,
            color: colors.iconColor
        },
        text: {
            fontFamily: fonts.irohamaruMikami,
            fontSize: 17,
            lineHeight: 22,
            color: colors.textColor
        },
        textAlt: {
            fontFamily: fonts.irohamaruMikami,
            fontSize: 17,
            lineHeight: 22,
            color: colors.iconColor
        },
        bulletRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 4,
            gap: 8
        },
        bullet: {
            fontSize: 17,
            lineHeight: 22,
            color: colors.iconColor
        }
    })
}