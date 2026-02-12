import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: colors.background,
            gap: 25
        },
        iconContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5
        },
        text: {
            fontFamily: "Honoka-Shin-Antique-Kaku",
            fontSize: 14,
            color: colors.textColor
        }
    })
}