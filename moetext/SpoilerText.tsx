/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Pressable, StyleProp, TextStyle} from "react-native"
import Text from "./TextFallback"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/SpoilerText.styles"

interface Props {
    children: React.ReactNode
    style?: StyleProp<TextStyle>
}

const SpoilerText: React.FunctionComponent<Props> = ({children, style}) => {
    const [shown, setShown] = useState(false)
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <Pressable onPress={() => setShown(prev => !prev)}
            style={{backgroundColor: shown ? "transparent" : colors.textColor}}>
            <View style={{opacity: shown ? 1 : 0}} pointerEvents={shown ? "auto" : "none"}
                accessibilityElementsHidden={!shown} importantForAccessibility={shown ? "auto" : "no-hide-descendants"}>
                {typeof children === "string" ? (
                    <Text style={[style, styles.shown]} selectable uiTextView selectionColor={colors.borderColor}>
                        {children}
                    </Text>
                ) : children}
            </View>
        </Pressable>
    )
}

export default SpoilerText