import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: colors.background,
            gap: 20
        },
        headerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 13
        },
        headerText: {
            color: colors.headingColor,
            fontFamily: fonts.jkGothicM,
            fontSize: 25
        },
        iconContainer: {
            marginTop: 0
        },
        imageContainer: {
            display: "flex",
            flexDirection: "row",
            width: "100%"
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