/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/Commentary.styles"
import CommentaryIcon from "../../assets/svg/commentary.svg"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
}

const Commentary: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [showTranslated, setShowTranslated] = useState(true)

    let iconSize = 30

    if (!props.post?.commentary?.trim()) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.post.commentary}</Text>
                <Pressable style={styles.iconContainer} onPress={() => setShowTranslated((prev) => !prev)}>
                    <CommentaryIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{showTranslated ? props.post?.englishCommentary : props.post?.commentary}</Text>
            </View>
        </View>
    )
}

export default Commentary