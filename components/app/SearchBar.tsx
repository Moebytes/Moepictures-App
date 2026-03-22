/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef} from "react"
import {View, TextInput, Pressable, Text, ScrollView} from "react-native"
import {useRoute, useNavigation, CommonActions} from "@react-navigation/native"
import IconButton from "../../ui/IconButton"
import {useThemeSelector, useSearchActions, useSearchSelector, 
useSessionSelector, useFlagActions} from "../../store"
import {createStylesheet} from "./styles/SearchBar.styles"
import SearchIcon from "../../assets/svg/search.svg"
import OptionsIcon from "../../assets/svg/options.svg"
import RandomIcon from "../../assets/svg/random.svg"
import XIcon from "../../assets/svg/x.svg"
import functions from "../../functions/Functions"
import clone from "fast-clone"

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
    const {setRandomSearchFlag} = useFlagActions()
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

    const handleKeyPress = (e: any) => {
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

            const state = navigation.getState()!

            const routes = clone(state.routes) as any
            let lastRoute = routes[routes.length - 1]

            const newRoute = {
                name: "Post",
                params: {postID: result[0].postID},
                key: lastRoute.key
            }

            routes[routes.length - 1].key = `Post-${Date.now()}`

            navigation.dispatch(
                CommonActions.reset({
                    index: state.routes.length,
                    routes: [...routes, newRoute]
                })
            )
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
                <IconButton icon={RandomIcon} size={iconSize} color={colors.borderColor}
                    onPress={randomPost}/> :
                <IconButton icon={OptionsIcon} size={iconSize} color={colors.borderColor}/> }
            </Pressable>
        </View>
    )
}

export default SearchBar