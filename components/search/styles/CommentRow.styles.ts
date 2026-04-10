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
            alignItems: "center",
            width: "90%",
            alignSelf: "center",
            gap: 10,
            borderRadius: 13,
            backgroundColor: colors.itemBG,
            marginBottom: 10
        },
        imageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 10,
            paddingVertical: 10
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 6,
            paddingVertical: 7,
            gap: 7,
            flexShrink: 1,
            flexWrap: "wrap"
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 5
        },
        dateText: {
            color: colors.iconColor,
            textAlign: "center",
            fontFamily: fonts.irohamaruMikami,
            fontSize: 12
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.irohamaruMikami,
            fontSize: 13
        },
        optionsContainer: {
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 6,
            paddingVertical: 6
        },
        optionContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }
    })
}