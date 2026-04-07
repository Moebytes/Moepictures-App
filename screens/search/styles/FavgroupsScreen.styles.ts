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
            backgroundColor: colors.background,
            gap: 12
        },
        titleContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            paddingTop: 10,
            marginBottom: 5
        },
        title: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 26,
            lineHeight: 30
        },
        itemContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 10,
            gap: 20
        },
        headerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        headerText: {
            color: colors.headingColor,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 25,
            lineHeight: 29
        },
        headerTextAlt: {
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 20
        },
        carousel: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
    })
}