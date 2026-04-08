/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {StyleProp, TextStyle} from "react-native"
import ScalableHaptic from "../ui/ScalableHaptic"
import {UITextView as Text} from "react-native-uitextview"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/Link.styles"
import functions from "../functions/Functions"

interface Props {
    href: string
    children: React.ReactNode
    style?: StyleProp<TextStyle>
}

const Link: React.FunctionComponent<Props> = ({href, children, style}) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <ScalableHaptic scaleFactor={0.97} onPress={() => functions.link.openSocialLink(href)}>
            <Text style={[style, styles.text]} selectable uiTextView 
            selectionColor={colors.borderColor}>{children}</Text>
        </ScalableHaptic>
    )
}

export default Link