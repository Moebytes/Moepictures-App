/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, Pressable, Linking} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PixivTags.styles"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
}

const PixivTags: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [activeTag, setActiveTag] = useState("")

    const pixivTags = props.post?.pixivTags ?? []

    const generateJSX = () => {
        let jsx = [] as React.ReactElement[]
        for (const tag of pixivTags) {
            const isActive = activeTag === tag

            const onPress = async () => {
                Linking.openURL(`https://www.pixiv.net/tags/${encodeURIComponent(tag)}/artworks`)
                setActiveTag("")
            }

            jsx.push(
                <PressableHaptic key={tag} delayLongPress={200} onLongPress={() => null}
                    onPressIn={() => setActiveTag(tag)} onPress={onPress} onPressOut={() => setActiveTag("")}
                    style={[styles.tagContainer, isActive && styles.tagContainerActive]}>
                    <Text style={[styles.tag, isActive && styles.tagActive]}>{tag}</Text>
                </PressableHaptic>
            )
        }
        return jsx
    }

    if (!pixivTags.length) return null

    return (
        <View style={styles.container}>
            {generateJSX()}
        </View>
    )
}

export default PixivTags