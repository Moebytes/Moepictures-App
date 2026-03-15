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
            flexDirection: "column",
            width: "100%",
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.background,
            gap: 15,
            flex: 1
        },
        titleContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginBottom: 5
        },
        title: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 26
        },
        footer: {
            marginBottom: 10
        }
    })
}