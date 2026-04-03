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
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor: colors.profileBG,
            flex: 1
        },
        containerBG: {
            resizeMode: "cover"
        },
        box: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 15,
            paddingHorizontal: 30,
            paddingVertical: 20,
            width: "90%",
            gap: 20
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 5
        },
        centerRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        title: {
            fontFamily: fonts.pixelArial11,
            fontSize: 27,
            color: colors.drawerTitle,
            fontWeight: "100"
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 14,
            lineHeight: 16,
            color: colors.black
        },
        text2: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 16,
            lineHeight: 19,
            marginTop: -4,
            color: colors.buttonColor
        },
        text3: {
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 18,
            lineHeight: 22,
            color: colors.buttonColor
        },
        inputWrapper: {
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: "100%"
        },
        inputIcon: {
            position: "absolute",
            left: 10,
            zIndex: 1
        },
        inputIcon2: {
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{translateY: -11}],
            zIndex: 1
        },
        textInput: {
            height: 35,
            paddingVertical: 5,
            paddingLeft: 45,
            paddingRight: 45,
            borderRadius: 8,
            backgroundColor: colors.white,
            width: "100%",
            fontFamily: fonts.genEiMGothicV2,
            color: colors.black,
            fontSize: 19
        },
        captchaWrapper: {
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            backgroundColor: colors.white,
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderRadius: 8
        },
        captchaInput: {
            height: 35,
            paddingVertical: 5,
            paddingHorizontal: 5,
            borderRadius: 8,
            backgroundColor: colors.white,
            width: "100%",
            fontFamily: fonts.genEiMGothicV2,
            color: colors.black,
            fontSize: 19,
            borderWidth: 1,
            borderColor: colors.black
        },
        wideButton: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: colors.buttonColor,
            width: "100%",
            borderRadius: 8
        },
        wideButtonText: {
            fontFamily: fonts.tsunagiGothicBlack,
            color: colors.white,
            fontSize: 20,
            lineHeight: 22
        }
    })
}