/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet, Platform} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 20,
            backgroundColor: colors.background,
            gap: 25,
        },
        artistContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8
        },
        artistIcon: {
            borderRadius: 35,
            height: Platform.OS === "android" ? 50 : 55,
            width: Platform.OS === "android" ? 50 : 55
        },
        artistText: {
            fontFamily: fonts.irohamaruMikami,
            fontSize: Platform.OS === "android" ? 22 : 24,
            color: colors.iconColor
        },
        sourceIcon: {
            height: Platform.OS === "android" ? 50 : 55,
            width: Platform.OS === "android" ? 50 : 55
        }
    })
}