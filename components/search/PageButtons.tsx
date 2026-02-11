import React from "react"
import {View, Pressable, Text} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PageButtons.styles"

const PageButtons: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <View style={styles.container}>
            <Pressable style={styles.button}>
                <Text style={styles.text}>1</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text}>2</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text}>3</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text}>{">"}</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text}>{">>"}</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text}>?</Text>
            </Pressable>
        </View>
    )
}

export default PageButtons