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
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.profileBG,
            gap: 20,
            flex: 1
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
        },
        box: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        bioContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: colors.profileLogin,
            width: "100%",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10
        },
        labelText: {
            color: colors.iconColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 25,
            lineHeight: 30
        },
        dangerText: {
            color: colors.dangerColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 25,
            lineHeight: 30
        },
        separator: {
            height: 1,
            width: "100%",
            backgroundColor: colors.dangerColor
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 22,
            borderRadius: 12,
            height: 80,
            backgroundColor: colors.profileItemPressed
        },
        buttonContainer2: {
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
        loginText: {
            color: colors.iconColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            textAlign: "center",
            fontSize: 22,
            lineHeight: 26
        },
        activeButtonContainer: {
            backgroundColor: colors.profileItemPressed2
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20
        },
        buttonText: {
            color: colors.textColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 25,
            lineHeight: 30
        }
    })
}