/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../../ui/colors"
import {fonts} from "../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        text: {
            fontFamily: fonts.jkGothicM,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor
        },
        codeText: {
            fontFamily: fonts.sourceCodePro,
            fontSize: 13,
            lineHeight: 16,
            color: colors.textColor
        },
        boldText: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 15,
            lineHeight: 20,
            color: colors.textColor
        },
        italicText: {
            fontFamily: fonts.clearSansItalic,
            fontSize: 14,
            lineHeight: 20,
            color: colors.textColor
        },
        highlightText: {
            fontFamily: fonts.jkGothicM,
            fontSize: 13,
            lineHeight: 16,
            color: colors.highlightColor
        },
        mentionText: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 15,
            lineHeight: 20,
            color: colors.highlightColor
        },
        emoji: {
            width: 30,
            height: 30
        },
        image: {
            width: 200,
            height: 200,
            resizeMode: "contain"
        },
        quoteContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%"
        }, 
        quoteUser: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 14,
            lineHeight: 16,
            marginLeft: 2,
            color: colors.highlightColor
        }
    })
}