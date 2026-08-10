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
            backgroundColor: colors.background,
            gap: 20
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 15
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
            fontSize: 25,
            lineHeight: 30
        },
        labelText: {
            color: colors.buttonColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            lineHeight: 35
        },
        carousel: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            alignItems: "center"
        }
    })
}