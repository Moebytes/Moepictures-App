import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            flex: 1, 
            backgroundColor: colors.background
        },
        row: {
            justifyContent: "space-evenly",
            marginBottom: 10,
        },
        footer: {
            marginBottom: 10
        }
    })
}