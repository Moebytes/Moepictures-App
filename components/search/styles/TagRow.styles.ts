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
            paddingHorizontal: 10,
            paddingVertical: 5,
            gap: 10,
            borderRadius: 7,
            backgroundColor: colors.itemBG,
            marginBottom: 10
        },
        tagContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            maxWidth: 100,
            gap: 7
        },
        tag: {
            color: colors.tagColor,
            fontFamily: fonts.irohamaruMikami,
            fontSize: 13
        },
        count: {
            color: colors.textColor,
            fontFamily: fonts.tsunagiGothicBlack,
            fontSize: 13
        },
        textContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.irohamaruMikami,
            fontSize: 13
        },
        image: {
            height: 40,
            width: 40
        },
        icon: {
            height: 20,
            width: 20
        },
    })
}