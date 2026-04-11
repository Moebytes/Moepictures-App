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
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 30,
            paddingBottom: 100,
            gap: 20,
            backgroundColor: colors.background
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 10
        },
        centerRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            gap: 10
        },
        box: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        tagColumn: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            paddingVertical: 15,
            gap: 30
        },
        tagBox: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10
        },
        label: {
            fontFamily: fonts.genEiMGothicV2,
            color: colors.iconColor,
            fontSize: 21,
            lineHeight: 25
        },
        textInput: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "96%",
            height: 40,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.gray,
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 20,
            paddingHorizontal: 10
        },
        bigInput: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "96%",
            height: 170,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.gray,
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 17,
            paddingHorizontal: 10
        },
        wideButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: colors.buttonColor,
            width: "100%",
            borderRadius: 8
        },
        wideButtonText: {
            fontFamily: fonts.tsunagiGothicBlack,
            color: colors.white,
            fontSize: 20,
            lineHeight: 22
        }
    })
}