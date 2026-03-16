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
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: colors.background,
            rowGap: 15,
            columnGap: 11
        },
        tagContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: colors.background,
            borderColor: colors.iconColor,
            borderStyle: "solid"
        },
        tagContainerActive: {
            backgroundColor: colors.iconColor,
            borderColor: colors.background
        },
        tag: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 19,
            color: colors.iconColor
        },
        tagActive: {
            color: colors.background
        }
    })
}