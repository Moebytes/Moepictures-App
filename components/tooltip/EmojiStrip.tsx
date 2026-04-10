/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {Fragment, useState, useEffect, useRef} from "react"
import {Image, ScrollView, Keyboard, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {LiquidGlassContainerView, LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useCacheSelector, useLayoutSelector, useFlagActions} from "../../store"
import {createStylesheet} from "./styles/EmojiStrip.styles"

const EmojiStrip: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const {emojis} = useCacheSelector()
    const {emojiStripVisible} = useLayoutSelector()
    const {setEmojiFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const scrollRef = useRef<ScrollView>(null)
    const scrollX = useRef(0)

    useEffect(() => {
        const keyboardDidShow = Keyboard.addListener("keyboardDidShow", (event) => {
            setKeyboardHeight(event.endCoordinates.height)
        })

        const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0)
        })

        return () => {
            keyboardDidShow.remove()
            keyboardDidHide.remove()
        }
    }, [])

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollX.current = event.nativeEvent.contentOffset.x
    }

    useEffect(() => {
        if (emojiStripVisible && scrollRef.current) {
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({
                    x: scrollX.current,
                    animated: false
                })
            })
        }
    }, [emojiStripVisible])

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined


    const rows = 2
    const size = 30
    const gap = 10
    const padding = 10

    const columns = [] as [string, string][][]
    const entries = Object.entries(emojis)
    for (let i = 0; i < entries.length; i += rows) {
        columns.push(entries.slice(i, i + rows))
    }

    const height = rows * size +
        (rows - 1) * gap +
        padding * 2

    return (
        <>
        {emojiStripVisible && (
            <LiquidGlassContainerView style={[styles.emojiAbsoluteWrapper, {bottom: keyboardHeight}]}>
                <LiquidGlassView effect="clear" style={[styles.emojiContainer, fallback]}>
                    <ScrollView ref={scrollRef} horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.emojiScroller, {height, gap, padding}]}
                    keyboardShouldPersistTaps="always"
                    onScroll={onScroll}
                    scrollEventThrottle={16}>
                        {columns.map((column, index) => (
                        <Fragment key={index}>
                            {column.map(([emoji, image]) => (
                                <PressableHaptic key={emoji} hitSlop={10} onPress={() => setEmojiFlag(emoji)}>
                                    <Image style={{width: size, height: size}} source={{uri: image}}/>
                                </PressableHaptic>
                            ))}
                        </Fragment>))}
                    </ScrollView>
                </LiquidGlassView>
            </LiquidGlassContainerView>
        )}
        </>
    )
}

export default EmojiStrip