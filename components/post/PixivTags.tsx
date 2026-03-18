/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text, Pressable, Linking} from "react-native"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
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

    const hapticFeedback = (tag: string) => {
        ReactNativeHapticFeedback.trigger("impactMedium")
        setActiveTag(tag)
    }

    const generateJSX = () => {
        let jsx = [] as React.ReactElement[]
        const pixivTags = props.post?.pixivTags ?? []
        for (const tag of pixivTags) {
            const isActive = activeTag === tag

            const onPress = async () => {
                setActiveTag(tag)
                Linking.openURL(`https://www.pixiv.net/tags/${encodeURIComponent(tag)}/artworks`)
            }

            jsx.push(
                <Pressable key={tag} delayLongPress={200} onLongPress={() => hapticFeedback(tag)}
                    onPress={onPress} onPressOut={() => setActiveTag("")}
                    style={[styles.tagContainer, isActive && styles.tagContainerActive]}>
                    <Text style={[styles.tag, isActive && styles.tagActive]}>{tag}</Text>
                </Pressable>
            )
        }
        return jsx
    }

    return (
        <View style={styles.container}>
            {generateJSX()}
        </View>
    )
}

export default PixivTags