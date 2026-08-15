/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../ui/colors"

export const createStylesheet = (colors: ThemeColors, width: number, height: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "black"
        },
        page: {
            width,
            height,
            justifyContent: "center",
            alignItems: "center"
        },
        zoomContainer: {
            width,
            height
        },
        image: {
            width,
            height
        }
    })
}