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
        overlay: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "box-none",
            zIndex: 1000,
            elevation: 1000
        },
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderRadius: 10,
            overflow: "hidden",
            gap: 10
        },
        absolute: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        text: {
            color: colors.black,
            fontFamily: fonts.irohamaruMikami,
            textAlign: "center",
            fontSize: 23
        }
    })
}