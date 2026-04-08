/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../ui/colors"
import {fonts} from "../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 7
        },
        text: {
            fontFamily: fonts.irohamaruMikami,
            fontSize: 15,
            lineHeight: 17,
            color: colors.highlightColor
        },
        favicon: {
            width: 18,
            height: 18
        }
    })
}