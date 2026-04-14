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
        textContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            flexWrap: "wrap",
            gap: 10
        },
        tag: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 22,
            lineHeight: 27,
            color: colors.textColor
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            lineHeight: 16,
            color: colors.textColor
        },
        italicText: {
            fontFamily: fonts.clearSansItalic,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor
        },
        image: {
            height: 60,
            width: 60
        },
        icon: {
            height: 35,
            width: 35
        },
        pixivTagContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: colors.background,
            borderColor: colors.iconColor,
            borderStyle: "solid"
        },
        pixivTagContainerActive: {
            backgroundColor: colors.iconColor,
            borderColor: colors.background
        },
        pixivTag: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 19,
            lineHeight: 25,
            color: colors.iconColor
        },
        pixivTagActive: {
            color: colors.background
        },
        aliasTagContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: colors.iconColor,
            borderColor: colors.background,
            borderStyle: "solid"
        },
        aliasTagContainerActive: {
            backgroundColor: colors.background,
            borderColor: colors.iconColor
        },
        aliasTag: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 19,
            lineHeight: 23,
            color: colors.background
        },
        aliasTagActive: {
            color: colors.iconColor
        },
        implicationTag: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 16,
            lineHeight: 20,
            color: colors.iconColor
        },
        row: {
            justifyContent: "space-evenly",
            alignItems: "center"
        },
        footer: {
            marginBottom: 10
        }
    })
}