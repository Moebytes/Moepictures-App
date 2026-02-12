import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.background,
            paddingHorizontal: 11,
            height: 37
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 13
        }
    })
}