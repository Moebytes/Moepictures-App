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
            height: 48,
            gap: 18,
        },
        textInput: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 3,
            height: 34,
            width: 317,
            borderRadius: 11,
            backgroundColor: colors.searchBG,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderStyle: "solid",
            color: colors.textColor,
            fontFamily: "GenEi M Gothic v2",
            fontSize: 16,
            paddingLeft: 30
        },
        searchIconContainer: {
            position: "absolute",
            left: 25
        }
    })
}