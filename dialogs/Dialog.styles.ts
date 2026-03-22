/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {StyleSheet} from "react-native"
import {ThemeColors} from "../ui/colors"
import {fonts} from "../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        overlay: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "box-none",
            zIndex: 1000,
            elevation: 1000
            //backgroundColor: "#00000054"
        },
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
            borderWidth: 1,
            borderColor: colors.black,
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderRadius: 12,
            minWidth: 200,
            gap: 20
        },
        scrollerContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
            borderWidth: 1,
            borderColor: colors.black,
            borderRadius: 12
        },
        scrollContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 20,
            minWidth: 200,
            gap: 20
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        rowContent: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5
        },
        title: {
            color: colors.black,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            lineHeight: 25
        },
        text: {
            color: colors.black,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 18,
            lineHeight: 25
        },
        input: {
            color: colors.iconColor,
            fontFamily: fonts.genEiMGothicV2,
            borderWidth: 1,
            borderColor: colors.black,
            paddingHorizontal: 8,
            paddingVertical: 5,
            fontSize: 20,
            width: 80
        },
        button: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 7,
            backgroundColor: colors.buttonColorGlass,
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
            fontSize: 19
        },
        buttonTextActive: {
            color: colors.white
        },
        separator: {
            height: 1,
            width: "50%",
            backgroundColor: colors.black
        },
        rowButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            overflow: "hidden",
            paddingVertical: 5,
            borderRadius: 10,
            gap: 10
        },
        absolute: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
    })
}