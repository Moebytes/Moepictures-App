/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TagRow.styles"

interface Props {
    tag: string
    count: number
    text: string
    type: string
}

const TagRow: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const getColor = () => {
        if (props.type === "accessory") return colors.accessoryTagColor
        if (props.type === "outfit") return colors.outfitTagColor
        if (props.type === "scenery") return colors.sceneryTagColor
        return colors.tagColor
    }

    return (
        <View style={styles.container}>
            <View style={styles.tagContainer}>
                <Text style={{...styles.tag, color: getColor()}}>{props.tag}</Text>
                <Text style={styles.count}>{props.count}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </View>
    )
}

export default TagRow