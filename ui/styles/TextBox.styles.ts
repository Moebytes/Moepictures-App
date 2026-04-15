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
        textboxContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            gap: 10
        },
        textbox: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            borderWidth: 1.3,
            borderColor: colors.iconColor,
            borderRadius: 15
        },
        textboxButtonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 13,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderColor: colors.iconColor
        },
        textboxButton: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        textInput: {
            width: "100%",
            height: 150,
            color: colors.textColor,
            fontFamily: fonts.jkGothicM,
            paddingHorizontal: 5,
            textAlignVertical: "top",
            fontSize: 20,
            lineHeight: 20
        },
        previewContainer: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            paddingHorizontal: 5,
            paddingVertical: 5,
            fontSize: 20
        },
        errorText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 16,
            lineHeight: 19,
            marginTop: -4,
            color: colors.buttonColor
        },
        banText: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 16,
            lineHeight: 19,
            color: colors.buttonColor
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: 10
        },
        button: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 7,
            backgroundColor: colors.buttonColor,
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.black
        },
        buttonActive: {
            borderColor: colors.white
        },
        buttonText: {
            color: colors.black,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 22
        },
        buttonTextActive: {
            color: colors.white
        },
    })
}