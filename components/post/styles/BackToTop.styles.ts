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
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.mainColor,
            paddingHorizontal: 25,
            paddingVertical: 5,
            width: "100%"
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        text: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 15,
            lineHeight: 20,
            color: colors.textColor
        }
    })
}