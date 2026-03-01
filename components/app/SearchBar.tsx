/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, TextInput, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/SearchBar.styles"
import SearchIcon from "../../assets/svg/search.svg"
import OptionsIcon from "../../assets/svg/options.svg"

const SearchBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 25

    return (
        <View style={styles.container}>
            <View style={styles.textInputWrapper}>
                <TextInput style={styles.textInput} selectionColor={colors.borderColor}/>
                <View style={styles.searchIconContainer}>
                    <SearchIcon width={iconSize} height={iconSize} color={colors.borderColor}/>
                </View>
            </View>
            <Pressable>
                <OptionsIcon width={iconSize} height={iconSize} color={colors.borderColor}/>
            </Pressable>
        </View>
    )
}

export default SearchBar