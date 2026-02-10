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
            height: 63,
            gap: 13,
        },
        textContainer: {
            display: "flex",
            flexDirection: "row"
        },
        textA: {
            color: colors.moeTextA,
            fontSize: 44,
            fontFamily: "GenEi M Gothic v2"
        },
        textB: {
            color: colors.moeTextB,
            fontSize: 44,
            fontFamily: "GenEi M Gothic v2"
        },
        icon: {
            width: 63,
            height: 63
        }
    })
}