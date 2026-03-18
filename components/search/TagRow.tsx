/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TagRow.styles"
import {TagSearch} from "../../types/Types"

interface Props {
    tag: TagSearch
}

const TagRow: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const getColor = () => {
        if (props.tag.type === "artist") return colors.artistTagColor
        if (props.tag.type === "character") return colors.characterTagColor
        if (props.tag.type === "series") return colors.seriesTagColor
        if (props.tag.type === "meta") return colors.metaTagColor
        if (props.tag.type === "appearance") return colors.appearanceTagColor
        if (props.tag.type === "outfit") return colors.outfitTagColor
        if (props.tag.type === "accessory") return colors.accessoryTagColor
        if (props.tag.type === "action") return colors.actionTagColor
        if (props.tag.type === "scenery") return colors.sceneryTagColor
        return colors.tagColor
    }

    return (
        <View style={styles.container}>
            <View style={styles.tagContainer}>
                <Text style={{...styles.tag, color: getColor()}}>{props.tag.tag}</Text>
                <Text style={styles.count}>{props.tag.postCount}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.tag.description}</Text>
            </View>
        </View>
    )
}

export default TagRow