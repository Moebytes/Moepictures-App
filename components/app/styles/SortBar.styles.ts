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
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 11,
            height: 37
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 13
        },
        textButton: {
            fontFamily: fonts.tsunagiGothicBlack,
            marginRight: -4,
            fontSize: 19,
            color: colors.iconColor
        }
    })
}