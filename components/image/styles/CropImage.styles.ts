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
            flex: 1,
            position: "relative",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        image: {
            width: "100%",
            height: "100%"
        },
        headerContainer: {
            position: "absolute",
            top: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 10,
            zIndex: 10
        },
        headerButton: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            gap: 8,
            paddingVertical: 7,
            paddingHorizontal: 15
        },
        headerText: {
            fontFamily: fonts.genEiMGothicV2,
            fontSize: 20,
            color: colors.white
        }
    })
}