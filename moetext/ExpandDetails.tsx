/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Pressable, StyleProp, TextStyle} from "react-native"
import Text from "./TextFallback"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/ExpandDetails.styles"

interface Props {
    summary: React.ReactNode
    details: React.ReactNode
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
                <View style={styles.summary}>
                    <Text style={[style, {fontFamily: styles.summary.fontFamily,
                        fontSize: styles.summary.fontSize, fontWeight: "bold"}]} selectable uiTextView
                        selectionColor={colors.borderColor}>
                        {open ? "▾ " : "▸ "}
                        {typeof summary === "string" ? summary : null}
                    </Text>
                    {typeof summary === "string" ? null : <View style={{flex: 1}}>{summary}</View>}
                </View>
            </Pressable>

            {open ? <View style={styles.details}>
                {typeof details === "string" ? <Text style={style} selectable uiTextView
                    selectionColor={colors.borderColor}>{details}</Text> : details}
            </View> : null}
        </View>
    )
}

export default ExpandDetails