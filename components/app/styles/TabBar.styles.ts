import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

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
            fontFamily: "Honoka-Shin-Antique-Kaku_M",
            fontSize: 12,
            color: colors.textColor
        }
    })
}