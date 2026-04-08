/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {Pressable, StyleProp, TextStyle} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
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
        <Pressable onPress={() => setShown(prev => !prev)}>
            <Text style={[style, styles.spoiler, shown && styles.shown]}
                selectable uiTextView selectionColor={colors.borderColor}>
                {children}
            </Text>
        </Pressable>
    )
}

export default SpoilerText