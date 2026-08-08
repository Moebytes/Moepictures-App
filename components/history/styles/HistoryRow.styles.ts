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
        columnContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "90%",
            alignSelf: "center",
            borderRadius: 13,
            backgroundColor: colors.itemBG,
            marginBottom: 10
        },
        imageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 10,
            paddingVertical: 10,
            gap: 5
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            width: "100%",
            paddingHorizontal: 6,
            paddingVertical: 7,
            gap: 4,
            flexShrink: 1
        },
        rowContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 5
        },
        dateContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 5
        },
        dateText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            lineHeight: 16,
            color: colors.textColor,
            fontStyle: "italic"
        },
        title: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 17,
            lineHeight: 19,
            color: colors.iconColor
        },
        changeText: {
            fontFamily: fonts.jkGothicM,
            fontSize: 13,
            lineHeight: 16,
            fontWeight: "bold",
            color: colors.iconColor
        },
        label: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 13,
            lineHeight: 16,
            color: colors.iconColor
        },
        text: {
            fontFamily: fonts.jkGothicM,
            fontSize: 13,
            lineHeight: 16,
            color: colors.textColor
        },
        tagAdd: {
            fontFamily: fonts.jkGothicM,
            fontSize: 13,
            lineHeight: 16,
            color: colors.tagAdd
        },
        tagRemove: {
            fontFamily: fonts.jkGothicM,
            fontSize: 13,
            lineHeight: 16,
            color: colors.tagRemove
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
        optionsContainerRelative: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
            gap: 12,
            paddingHorizontal: 6,
            paddingVertical: 6
        },
        optionContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        icon: {
            height: 30,
            width: 30
        }
    })
}