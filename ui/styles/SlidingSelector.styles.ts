/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../colors"
import {fonts} from "../fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 10,
            overflow: "hidden"
        },
        slider: {
            position: "absolute",
            top: 0,
            bottom: 0,
            borderRadius: 10,
            zIndex: 0
        },
        button: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 17,
            paddingVertical: 7,
            gap: 6,
            zIndex: 1
        },
        buttonText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            color: colors.textColor,
            fontSize: 14,
            lineHeight: 17
        }
    })
}