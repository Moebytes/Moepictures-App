/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            flex: 1, 
            backgroundColor: colors.background
        },
        row: {
            justifyContent: "space-evenly",
            alignItems: "center",
            marginBottom: 10,
        },
        footer: {
            marginBottom: 10
        }
    })
}