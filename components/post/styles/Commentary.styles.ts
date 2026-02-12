import {StyleSheet} from "react-native"
import {ThemeColors} from "../../../ui/colors"
import {fonts} from "../../../ui/fonts"

export const createStylesheet = (colors: ThemeColors) => {
    return StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            paddingBottom: 10,
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
            marginTop: 10
        },
        textContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap"
        },
        text: {
            color: colors.textColor,
            fontFamily: fonts.jkGothicM,
            fontSize: 16,
            lineHeight: 30
        }
    })
}