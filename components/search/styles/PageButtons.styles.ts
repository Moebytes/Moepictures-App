import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10
        },
        button: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 45,
            height: 45,
            borderRadius: 12,
            backgroundColor: colors.pageNumFill
        },
        text: {
            fontFamily: "Honoka-Shin-Antique-Kaku",
            color: colors.pageNumColor,
            fontSize: 20
        }
    })
}