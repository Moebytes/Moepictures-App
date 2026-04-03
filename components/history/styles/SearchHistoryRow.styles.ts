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
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            alignSelf: "center",
            gap: 10,
            borderRadius: 13,
            backgroundColor: colors.itemBG,
            marginBottom: 10
        },
        imageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 10,
            paddingVertical: 10
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingHorizontal: 6,
            paddingVertical: 7,
            gap: 4,
            flexShrink: 1,
            flexWrap: "wrap"
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5
        },
        dateText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            color: colors.textColor,
            fontStyle: "italic"
        },
        label: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            color: colors.iconColor
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            color: colors.textColor
        }
    })
}