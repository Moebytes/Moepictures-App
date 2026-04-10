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
        emojiAbsoluteWrapper: {
            position: "absolute",
            width: "100%",
            left: 0,
            zIndex: 1050,
            elevation: 1050
        },
        emojiContainer: {
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            borderRadius: 20,
            margin: 10
        },
        emojiScroller: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap"
        }
    })
}