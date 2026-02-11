import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.borderColor,
            borderRadius: 3,
            borderStyle: "solid",
            alignSelf: "flex-start"
        }
    })
}