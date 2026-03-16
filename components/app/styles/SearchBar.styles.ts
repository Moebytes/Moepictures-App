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
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.mainColor,
            paddingVertical: 7,
            paddingHorizontal: 14,
            height: 48,
            gap: 18,
        },
        textInputWrapper: {
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            minHeight: 34,
            borderRadius: 11,
            backgroundColor: colors.searchBG,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            paddingLeft: 30,
            paddingRight: 8
        },
        textInputContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        textInput: {
            minWidth: 80,
            height: 30,
            color: colors.textColor,
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 16,
            padding: 0
        },
        searchIconContainer: {
            position: "absolute",
            left: 5
        },
        tag: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 6,
            paddingVertical: 4,
            borderRadius: 5,
            marginRight: 5,
            marginVertical: 3,
            backgroundColor: colors.buttonColor
        },
        tagText: {
            fontFamily: fonts.genEiMGothicV2,
            color: colors.textColor2,
            fontSize: 12,
            lineHeight: 17,
            marginRight: 4
        }
    })
}