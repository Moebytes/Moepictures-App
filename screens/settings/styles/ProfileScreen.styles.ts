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
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.profileBG,
            gap: 10
        },
        pfp: {
            height: 40,
            width: 40,
            borderRadius: 5
        },
        loginText: {
            color: colors.iconColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            textAlign: "center",
            fontSize: 22,
            lineHeight: 26
        },
        buttonContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: 16,
            overflow: "hidden"
        },
        itemContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 17,
            backgroundColor: colors.profileItem,
            width: "100%"
        },
        separator: {
            height: 1,
            width: "95%",
            backgroundColor: colors.profileSeperator
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.genEiMGothicV2,
            textAlign: "center",
            fontSize: 19,
            lineHeight: 24
        },
        copyContainer: {
            display: "flex",
            alignItems: "flex-start",
            paddingHorizontal: 2,
            width: "100%",
            gap: 10
        },
        copyText: {
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            textAlign: "center",
            fontSize: 16
        },
        textContainer: {
            display: "flex",
            flexDirection: "row"
        },
        textA: {
            color: colors.moeTextA,
            fontSize: 25,
            lineHeight: 30,
            fontFamily: fonts.tsunagiGothicBlack
        },
        textB: {
            color: colors.moeTextB,
            fontSize: 25,
            lineHeight: 30,
            fontFamily: fonts.tsunagiGothicBlack
        },
    })
}