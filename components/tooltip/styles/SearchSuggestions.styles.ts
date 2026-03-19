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
        suggestionContainer: {
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            borderRadius: 20,
            margin: 10
        },
        suggestionScroller: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 10,
            gap: 10
        },
        suggestion: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 6,
            borderRadius: 15,
            backgroundColor: colors.tagColorGlass
        },
        suggestionText: {
            fontFamily: fonts.irohamaruMikami,
            color: "white",
            fontSize: 15,
            textAlign: "center"
        },
        suggestionAbsoluteWrapper: {
            position: "absolute",
            width: "100%",
            left: 0,
            zIndex: 999,
            elevation: 999
        }
    })
}