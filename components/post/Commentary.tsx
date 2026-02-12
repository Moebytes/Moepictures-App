import React from "react"
import {View, Text, Image, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/Commentary.styles"
import CommentaryIcon from "../../assets/svg/commentary.svg"

const Commentary: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 30

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Commentary</Text>
                <Pressable style={styles.iconContainer}>
                    <CommentaryIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>It is a new cover of C100. The outsourcing has begun, so thank you! [Melon Books] https://www.melonbooks.co.jp/detail/detail.php?product_id=1580900</Text>
            </View>
        </View>
    )
}

export default Commentary