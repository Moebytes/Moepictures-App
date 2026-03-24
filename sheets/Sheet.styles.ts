/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../ui/colors"
import {fonts} from "../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 20
        },
        centerRow: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        row: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%"
        },
        mainTitle: {
            fontFamily: fonts.tsunagiGothicBlack,
            color: colors.textColor,
            fontSize: 25,
            lineHeight: 30
        },
        title: {
            fontFamily: fonts.tsunagiGothicBlack,
            color: colors.textColor,
            fontSize: 18,
            lineHeight: 22
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 6,
            overflow: "hidden"
        },
        button: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 17,
            paddingVertical: 7,
            gap: 6,
            backgroundColor: colors.optionInactive
        },
        buttonText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            color: colors.textColor,
            fontSize: 14,
            lineHeight: 17
        },
        toggleContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingVertical: 9,
            paddingHorizontal: 10,
            borderRadius: 11,
            shadowColor: colors.black,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            backgroundColor: colors.background,
            elevation: 2
        },
        evenContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%"
        },
        wideButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 60,
            paddingVertical: 7,
            borderRadius: 6,
            backgroundColor: colors.optionActive
        },
        wideButtonText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            color: colors.white,
            fontSize: 16,
            lineHeight: 20
        },
    })
}