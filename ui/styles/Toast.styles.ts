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
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.toastColor,
            backgroundColor: colors.background,
            width: "90%",
            gap: 10
        },
        textContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap"
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.jkGothicM,
            textAlign: "center",
            fontSize: 15,
            lineHeight: 19
        }
    })
}