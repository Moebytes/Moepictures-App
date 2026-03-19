/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useCallback} from "react"
import {View, TextInput, Pressable, Text, ScrollView} from "react-native"
import {useFocusEffect} from "@react-navigation/native"
import IconButton from "../../ui/IconButton"
import {useThemeSelector, useSearchActions, useSearchSelector} from "../../store"
import {createStylesheet} from "./styles/SearchBar.styles"
import SearchIcon from "../../assets/svg/search.svg"
import OptionsIcon from "../../assets/svg/options.svg"
import RandomIcon from "../../assets/svg/random.svg"
import XIcon from "../../assets/svg/x.svg"

interface Props {
    managedProps?: {
        text: string,
        setText: (text: string) => void
        searchTags: string[]
        setSearchTags: (tags: string[]) => void
        setSearch: (search: string) => void
    }
    random?: boolean
}

const SearchBar: React.FunctionComponent<Props> = ({managedProps, ...props}) => {
    const {colors} = useThemeSelector()
    let {text, searchTags} = useSearchSelector()
    let {setText, setFocused, setSearchTags, setSearch} = useSearchActions()
    const styles = createStylesheet(colors)
    const inputRef = useRef<TextInput>(null)
    const scrollRef = useRef<ScrollView>(null)

    if (managedProps) {
        text = managedProps.text
        setText = managedProps.setText as any
        searchTags = managedProps.searchTags
        setSearchTags = managedProps.setSearchTags as any
        setSearch = managedProps.setSearch as any
    }

    const addItem = () => {
        if (!text.trim()) return
        setSearchTags([...searchTags, text.trim()])
        setText("")
    }

    const removeItem = (index: number) => {
        setSearchTags(searchTags.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e: any) => {
        if (e.nativeEvent.key === "Backspace" && !text && searchTags.length) {
            setSearchTags(searchTags.slice(0, -1))
        }
    }

    let iconSize = 25
    let xSize = 8

    return (
        <View style={styles.container}>
            <View style={styles.textInputWrapper}>
                <Pressable style={{flex: 1}} onPress={() => inputRef.current?.focus()}>
                    <ScrollView ref={scrollRef} horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.textInputContainer}
                        keyboardShouldPersistTaps="always"
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: true})}>
                        {searchTags.map((item, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{item}</Text>
                                <Pressable onPress={() => removeItem(index)} hitSlop={10}>
                                    <XIcon width={xSize} height={xSize} color={colors.textColor2}/>
                                </Pressable>
                            </View>
                        ))}

                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            selectionColor={colors.borderColor}
                            value={text}
                            onChangeText={setText}
                            onSubmitEditing={addItem}
                            onKeyPress={handleKeyPress}
                            submitBehavior="submit"
                            autoCorrect={false}
                            spellCheck={false}
                            autoComplete="off"
                            importantForAutofill="no"
                            onFocus={() => {
                                setFocused(true)
                                scrollRef.current?.scrollToEnd({animated: true})
                            }}
                            onBlur={() => {
                                setFocused(false)
                                let tags = [...searchTags, text.trim()].filter(Boolean)
                                setSearchTags(tags)
                                setSearch(tags.join(" "))
                                setText("")
                            }}
                        />
                    </ScrollView>
                </Pressable>

                <View style={styles.searchIconContainer}>
                    <SearchIcon width={iconSize} height={iconSize} color={colors.borderColor}/>
                </View>
            </View>
            <Pressable>
                {props.random ?
                <IconButton icon={RandomIcon} size={iconSize} color={colors.borderColor}/> :
                <IconButton icon={OptionsIcon} size={iconSize} color={colors.borderColor}/> }
            </Pressable>
        </View>
    )
}

export default SearchBar