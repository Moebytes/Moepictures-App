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
            paddingVertical: 10,
            backgroundColor: colors.background,
            gap: 20
        },
        headerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 13
        },
        headerText: {
            color: colors.headingColor,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 25
        },
        headerTextAlt: {
            color: colors.buttonColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 25
        },
        iconContainer: {
            marginTop: 0
        },
        imageContainer: {
            display: "flex",
            flexDirection: "row",
            width: "100%"
        }
    })
}