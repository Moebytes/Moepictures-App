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
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 20
        },
        scrollContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 10
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
        column: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 10
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
        wideButton2: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
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
        tag: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 6,
            borderRadius: 15,
            gap: 5,
            backgroundColor: colors.artistTagColorGlass
        },
        tagText: {
            fontFamily: fonts.irohamaruMikami,
            color: colors.white,
            fontSize: 15,
            lineHeight: 18,
            textAlign: "center"
        },
        savedSearch: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 6,
            borderRadius: 8,
            gap: 5,
            backgroundColor: colors.savedSearchColor
        },
        savedSearchText: {
            fontFamily: fonts.genEiMGothicV2,
            color: colors.white,
            fontSize: 15,
            lineHeight: 18,
            textAlign: "center"
        }
    })
}