/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {Text, ScrollView, Keyboard} from "react-native"
import {LiquidGlassContainerView, LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useCacheSelector, useSearchSelector, useSearchActions} from "../../store"
import {createStylesheet} from "./styles/SearchSuggestions.styles"
import functions from "../../functions/Functions"
import {TagCount} from "../../types/Types"

const SearchSuggestions: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const {sortedTags} = useCacheSelector()
    const {text, focused, searchTags} = useSearchSelector()
    const {setText, setSearchTags} = useSearchActions()
    const styles = createStylesheet(colors)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [suggestions, setSuggestions] = useState<TagCount[]>([])

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

    const updateSearchSuggestions = async () => {
        const query = functions.tag.trimSpecialCharacters(text)
        let searchString = query?.trim().toLowerCase().split(/ +/g).filter(Boolean).join("-") ?? ""

        let tagCounts = sortedTags

        let suggestions = [] as TagCount[]
        for (const tagCount of tagCounts) {
            if (tagCount.tag.toLowerCase().includes(searchString)) suggestions.push(tagCount)
            if (suggestions.length >= 100) break
        }

        if (!suggestions?.length) {
            const newQuery = query.split(/ +/g).slice(-1).join("")
            if (!newQuery) return setSuggestions([])
            for (const tagCount of tagCounts) {
                if (tagCount.tag.toLowerCase().includes(newQuery)) suggestions.push(tagCount)
                if (suggestions.length >= 100) break
            }
        }

        setSuggestions(suggestions)
    }

    useEffect(() => {
        updateSearchSuggestions()
    }, [text])

    const addSuggestion = (suggestion: TagCount) => {
        setSearchTags([...searchTags, suggestion.tag])
        setText("")
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    return (
        <>
        {focused && suggestions.length > 0 && (
            <LiquidGlassContainerView style={[styles.suggestionAbsoluteWrapper, {bottom: keyboardHeight}]}>
                <LiquidGlassView effect="clear" style={[styles.suggestionContainer, fallback]}>
                    <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionScroller}
                    keyboardShouldPersistTaps="always">
                    {suggestions.map((suggestion, index) => (
                        <PressableHaptic key={index} hitSlop={10} onPress={() => addSuggestion(suggestion)}
                        style={[styles.suggestion, {backgroundColor: functions.tag.getGlassColor(suggestion, colors)}]}>
                        <Text style={styles.suggestionText}>
                            {suggestion.tag}
                        </Text>
                        </PressableHaptic>
                    ))}
                    </ScrollView>
                </LiquidGlassView>
            </LiquidGlassContainerView>
        )}
        </>
    )
}

export default SearchSuggestions