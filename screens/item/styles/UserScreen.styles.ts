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
            flex: 1,
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
        bioContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            paddingVertical: 10
        },
        labelText: {
            color: colors.textColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            lineHeight: 30
        }
    })
}