import React from "react"
import {View, Text, Image} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TitleBar.styles"

const TitleBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.textA}>M</Text>
                <Text style={styles.textB}>o</Text>
                <Text style={styles.textA}>e</Text>
                <Text style={styles.textB}>p</Text>
                <Text style={styles.textA}>i</Text>
                <Text style={styles.textB}>c</Text>
                <Text style={styles.textA}>t</Text>
                <Text style={styles.textB}>u</Text>
                <Text style={styles.textA}>r</Text>
                <Text style={styles.textB}>e</Text>
                <Text style={styles.textA}>s</Text>
            </View>
            <Image style={styles.icon} source={require("../../assets/icons/favicon.png")}/>
        </View>
    )
}

export default TitleBar