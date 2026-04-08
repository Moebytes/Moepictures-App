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
            alignItems: "flex-start",
            width: "100%",
            gap: 10,
            borderWidth: 1.5,
            borderColor: "transparent",
            borderRadius: 13,
            marginBottom: 10
        },
        userContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
            gap: 10
        },
        userText: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 18
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            paddingVertical: 10,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexShrink: 1,
            gap: 5
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 5
        },
        dateText: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.irohamaruMikami,
            fontSize: 12
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.irohamaruMikami,
            fontSize: 13
        }
    })
}