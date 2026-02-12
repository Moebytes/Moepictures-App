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
            height: 84,
            gap: 18
        },
        iconContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5
        },
        text: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 12,
            color: colors.textColor
        },
        activeText: {
            fontFamily: fonts.honokaShinAntiqueKaku,
            fontSize: 12,
            color: colors.iconColor
        }
    })
}