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
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            paddingTop: 5,
            backgroundColor: colors.background
        },
        carousel: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        },
        imageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderColor: colors.borderColor,
            borderStyle: "solid"
        }
    })
}