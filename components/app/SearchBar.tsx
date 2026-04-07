/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef} from "react"
import {View, TextInput, Pressable, Text, ScrollView, TextInputKeyPressEvent} from "react-native"
import {useRoute, useNavigation} from "@react-navigation/native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSearchActions, useSearchSelector, useFlagSelector,
useSessionSelector, useFlagActions, useSheetSelector, useSheetActions} from "../../store"
import {createStylesheet} from "./styles/SearchBar.styles"
import SearchIcon from "../../assets/svg/search.svg"
import OptionsIcon from "../../assets/svg/options.svg"
import RandomIcon from "../../assets/svg/random.svg"
import XIcon from "../../assets/svg/x.svg"
import functions from "../../functions/Functions"

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
    const {session} = useSessionSelector()
    let {text, search, searchTags} = useSearchSelector()
    let {setText, setFocused, setSearchTags, setSearch} = useSearchActions()
    const {searchScrollFlag} = useFlagSelector()
    const {setRandomSearchFlag, setSearchScrollFlag} = useFlagActions()
    const {showCommentsSheet, showNotesSheet, showSearchHistorySheet,
        showGroupsSheet, showTagsSheet} = useSheetSelector()
    const {setShowCommentsSheet, setShowNotesSheet, setShowSearchHistorySheet,
        setShowGroupsSheet, setShowTagsSheet} = useSheetActions()
    const styles = createStylesheet(colors)
    const inputRef = useRef<TextInput>(null)
    const scrollRef = useRef<ScrollView>(null)
    const navigation = useNavigation()
    const route = useRoute()

    if (managedProps) {
        text = managedProps.text
        setText = managedProps.setText as any
        searchTags = managedProps.searchTags
        setSearchTags = managedProps.setSearchTags as any
        setSearch = managedProps.setSearch as any
    }

    useEffect(() => {
        if (searchScrollFlag) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({x: 0})
            }, 100)
            setSearchScrollFlag(false)
        }
    }, [searchScrollFlag])

    const addItem = () => {
        if (!text.trim()) return
        setSearchTags([...searchTags, text.trim()])
        setText("")
    }

    const removeItem = (index: number) => {
        setSearchTags(searchTags.filter((_, i) => i !== index))
    }

    const commitItem = () => {
        let tags = [...searchTags, text.trim()].filter(Boolean)
        setSearchTags(tags)
        setSearch(tags.join(" "))
        setText("")
    }

    const handleKeyPress = (e: TextInputKeyPressEvent) => {
        if (e.nativeEvent.key === "Backspace" && !text && searchTags.length) {
            setSearchTags(searchTags.slice(0, -1))
        }
    }

    const randomPost = async () => {
        if (route.name === "Posts") {
            setRandomSearchFlag(true)
        } else if (route.name === "Post") {
            const result = await functions.http.get("/api/search/posts", {query: search, type: "image", 
                sort: "random", limit: 1}, session)
            if (!result.length) return
            
            functions.navigateToPost(result[0].postID, navigation)
        }
    }

    const openSheet = () => {
        if (route.name === "Comments") {
            setShowCommentsSheet(!showCommentsSheet)
        } else if (route.name === "Notes") {
            setShowNotesSheet(!showNotesSheet)
        } else if (route.name === "Tags") {
            setShowTagsSheet(!showTagsSheet)
        } else if (route.name === "Groups") {
            setShowGroupsSheet(!showGroupsSheet)
        } else if (route.name === "History") {
            setShowSearchHistorySheet(!showSearchHistorySheet)
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
                                commitItem()
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
                <ScalableHaptic icon={RandomIcon} size={iconSize} color={colors.borderColor}
                    onPress={randomPost}/> :
                <ScalableHaptic icon={OptionsIcon} size={iconSize} color={colors.borderColor}
                    onPress={openSheet}/> }
            </Pressable>
        </View>
    )
}

export default SearchBar