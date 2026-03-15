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
            width: "90%",
            alignSelf: "center",
            gap: 10,
            borderRadius: 13,
            backgroundColor: colors.itemBG,
            marginBottom: 15
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingHorizontal: 6,
            paddingVertical: 7,
            gap: 7
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5
        },
        userText: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 15
        },
        dateText: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.irohamaruMikami,
            fontSize: 12
        },
        text: {
            color: colors.textColor,
            textAlign: "center",
            fontFamily: fonts.irohamaruMikami,
            fontSize: 13
        }
    })
}