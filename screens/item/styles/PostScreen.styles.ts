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
        row: {
            justifyContent: "space-evenly",
            alignItems: "center"
        },
        footer: {
            marginBottom: 10
        },
        historyContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            gap: 10
        },
        historyText: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 23,
            lineHeight: 30,
            color: colors.historyColor
        },
        historyButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 7,
            backgroundColor: colors.historyColorGlass,
            borderRadius: 10,
            gap: 5
        },
        historyButtonActive: {
            borderColor: colors.white
        },
        historyButtonText: {
            color: colors.black,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 17
        },
        historyButtonTextActive: {
            color: colors.white
        }
    })
}