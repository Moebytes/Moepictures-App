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
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            gap: 20
        },
        title: {
            fontFamily: fonts.pixelArial11,
            color: colors.drawerTitle,
            fontSize: 25
        },
        rowItem: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 10
        },
        highlightText: {
            color: colors.drawerTitle,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 18,
            lineHeight: 22
        },
        text: {
            color: colors.black,
            fontFamily: fonts.jkGothicM,
            fontSize: 18,
            lineHeight: 22
        },
        tagContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 11
        },
        tag: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 7,
            paddingVertical: 6,
            borderRadius: 15,
            backgroundColor: colors.artistTagColorGlass
        },
        tagText: {
            fontFamily: fonts.irohamaruMikami,
            color: "white",
            fontSize: 15,
            textAlign: "center"
        }
    })
}