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
        navContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 14,
            gap: 10
        },
        navTextContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12
        },
        navText: {
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 23,
            lineHeight: 30
        },
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.profileBG,
            gap: 10,
            flex: 1
        },
        label: {
            color: colors.textColor,
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 23,
            lineHeight: 30
        },
        gradient: {
            width: "100%",
            height: 20,
            borderRadius: 10,
            justifyContent: "center"
        },

        slider: {
            position: "absolute",
            width: "100%",
            height: 40
        },
        resetButton: {
            marginTop: 15,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: colors.buttonColorGlass,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.black
        },
        resetText: {
            color: colors.black,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 18,
            textAlign: "center"
        }
    })
}