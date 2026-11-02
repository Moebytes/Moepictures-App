/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {StyleSheet, Text as NativeText} from "react-native"
import {UITextView} from "@bsky.app/react-native-uitextview"

type Props = React.ComponentProps<typeof UITextView>

// Workaround UITextView not supporting underline and strikethrough at the same time.
const TextFallback: React.FunctionComponent<Props> = (props) => {
    const style = StyleSheet.flatten(props.style)
    if (style?.textDecorationLine === "underline line-through") {
        const {uiTextView, ...nativeProps} = props
        return <NativeText {...nativeProps}/>
    }
    return <UITextView {...props}/>
}

export default TextFallback