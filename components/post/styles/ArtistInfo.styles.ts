import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: 40,
            paddingVertical: 20,
            backgroundColor: colors.background,
            gap: 25,
        },
        artistContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8
        },
        artistIcon: {
            borderRadius: 35,
            height: 55,
            width: 55
        },
        artistText: {
            fontFamily: "irohamaru mikami",
            fontSize: 24,
            color: colors.iconColor
        },
        sourceIcon: {
            height: 55,
            width: 55
        }
    })
}