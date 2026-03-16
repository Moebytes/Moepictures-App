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


const PixivTags: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [activeTag, setActiveTag] = useState("")

    const hapticFeedback = (tag: string) => {
        ReactNativeHapticFeedback.trigger("impactMedium")
        setActiveTag(tag)
    }

    const tags = [
        "ごちうさ", "香風智乃", "チノ", "ご注文はうさぎですか?",
        "笑顔", "ミニスカート", "高校生チノ", "クレープ",
        "セーラー服", "ごちうさ5000users入り"
    ]

    const generateJSX = () => {
        let jsx = [] as React.ReactElement[]
        for (const tag of tags) {
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