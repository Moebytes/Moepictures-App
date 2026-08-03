/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors, tablet: boolean) => {
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
            paddingHorizontal: 5,
            paddingVertical: 15,
            backgroundColor: colors.profileBG,
            flex: 1
        },
        containerBG: {
            resizeMode: "cover",
            height: tablet ? 3500 : undefined
        },
        box: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 15,
            paddingHorizontal: 25,
            paddingVertical: 20,
            width: "90%",
            gap: 20
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 8
        },
        centerRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        title: {
            fontFamily: fonts.pixelArial11,
            fontSize: 25,
            color: colors.drawerTitle,
            fontWeight: "100"
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 14,
            lineHeight: 22,
            color: colors.black
        },
        itemBox: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            borderRadius: 13,
            backgroundColor: colors.glassColor
        },
        itemBoxRow: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
            padding: 10,
            gap: 10
        },
        itemBoxTitle: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 29,
            lineHeight: 35
        },
        selectionBox: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 12,
            paddingVertical: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.black,
            backgroundColor: colors.premiumGlassColor
        },
        selectionBoxContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10
        },
        selectionBoxTitle: {
            color: colors.black,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 24,
            lineHeight: 26
        },
        selectionBoxPriceLabel: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 5,
            borderRadius: 9,
            backgroundColor: colors.premiumColor
        },
        selectionBoxPrice: {
            color: colors.black,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 18,
            lineHeight: 20
        },
        wideButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: colors.premiumColor,
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