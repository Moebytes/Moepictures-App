/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Pressable, StyleProp, TextStyle} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/ExpandDetails.styles"

interface Props {
    summary: string
    details: string
    style?: StyleProp<TextStyle>
}

const ExpandDetails: React.FunctionComponent<Props> = ({summary, details, style}) => {
    const [open, setOpen] = useState(false)
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setOpen(prev => !prev)}
                style={({pressed}) => pressed && styles.summaryPressed}>
                <Text style={[style, styles.summary]} selectable uiTextView 
                    selectionColor={colors.borderColor}>{open ? "▾ " : "▸ "}{summary}</Text>
            </Pressable>

            {open ? <Text style={[style, styles.details]} selectable uiTextView 
                selectionColor={colors.borderColor}>{details}</Text> : null}
        </View>
    )
}

export default ExpandDetails