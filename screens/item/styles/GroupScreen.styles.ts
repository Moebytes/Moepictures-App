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
            backgroundColor: colors.mainColor,
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
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 20,
            backgroundColor: colors.background,
            gap: 12
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap",
            gap: 10
        },
        title: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 30,
            lineHeight: 35,
            color: colors.borderColor
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 16,
            lineHeight: 19,
            color: colors.textColor,
            flexShrink: 1
        },
        headerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 15,
            backgroundColor: colors.background,
            gap: 13
        },
        headerText: {
            color: colors.headingColor,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 25
        },
        headerTextAlt: {
            color: colors.buttonColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20
        },
        headerTextAlt2: {
            color: colors.textColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            lineHeight: 20,
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            height: 22,
            gap: 10
        },
        row: {
            justifyContent: "space-evenly",
            alignItems: "center",
            marginBottom: 10
        },
        footer: {
            marginBottom: 10
        
        }
    })
}