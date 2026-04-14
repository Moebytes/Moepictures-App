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
        tabLabel: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            lineHeight: 27,
            color: colors.textColor
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
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap"
        },
        centerRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        column: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start"
        },
        rowItem: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10
        },
        title: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 24,
            color: colors.iconColor
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 17,
            color: colors.textColor
        },
        textAlt: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 17,
            color: colors.iconColor
        },
        image: {
            width: "100%"
        }
    })
}