/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Image, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TitleBar.styles"

const favicon = require("../../assets/icons/favicon.png")

const TitleBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()

    return (
        <Pressable style={{...styles.container, paddingTop: insets.top}}
            onPress={() => navigation.navigate("Posts", undefined, {pop: true})}>
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
            <Image style={styles.icon} source={favicon}/>
        </Pressable>
    )
}

export default TitleBar