/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef} from "react"
import {View, TextInput, Pressable, Text, ScrollView} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/SearchBar.styles"
import SearchIcon from "../../assets/svg/search.svg"
import OptionsIcon from "../../assets/svg/options.svg"
import RandomIcon from "../../assets/svg/random.svg"
import XIcon from "../../assets/svg/x.svg"

interface Props {
    random?: boolean
}

const SearchBar: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [text, setText] = useState("")
    const [items, setItems] = useState<string[]>([])
    const inputRef = useRef<TextInput>(null)
    const scrollRef = useRef<ScrollView>(null)

    const addItem = () => {
        if (!text.trim()) return
        setItems([...items, text.trim()])
        setText("")
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e: any) => {
        if (e.nativeEvent.key === "Backspace" && !text && items.length) {
            setItems(items.slice(0, -1))
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
                        {items.map((item, index) => (
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
                            onFocus={() => scrollRef.current?.scrollToEnd({animated: true})}
                        />
                    </ScrollView>
                </Pressable>

                <View style={styles.searchIconContainer}>
                    <SearchIcon width={iconSize} height={iconSize} color={colors.borderColor}/>
                </View>
            </View>
            <Pressable>
                {props.random ?
                <RandomIcon width={iconSize} height={iconSize} color={colors.borderColor}/> :
                <OptionsIcon width={iconSize} height={iconSize} color={colors.borderColor}/>}
            </Pressable>
        </View>
    )
}

export default SearchBar