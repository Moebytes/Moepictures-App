/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Image, StatusBar} from "react-native"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeActions, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import CheckIcon from "../../assets/svg/check.svg"
import {createStylesheet} from "./styles/LanguageScreen.styles"
import {Languages} from "../../types/ParamTypes"

const englishFlag = require("../../assets/icons/english.jpg")
const japaneseFlag = require("../../assets/icons/japanese.jpg")

const LanguageScreen: React.FunctionComponent = () => {
    const {i18n, language, theme, colors} = useThemeSelector()
    const {setLanguage} = useThemeActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    let languages = [
        {name: "English", code: "en", image: englishFlag},
        {name: "日本語", code: "ja", image: japaneseFlag}
    ]

    const generateOptionsJSX = () => {
        let jsx = [] as React.ReactElement[]
        for (const lang of languages) {
            let selected = language === lang.code

            jsx.push(
                <PressableHaptic onPress={() => setLanguage(lang.code as Languages)}
                    style={({pressed}) => [styles.buttonContainer, (pressed || selected) && styles.activeButtonContainer]}>
                    <View style={styles.flagContainer}>
                        <Image source={lang.image} style={{width: 32, height: 20}}/>
                        <Text style={styles.buttonText}>{lang.name}</Text>
                    </View>
                    {selected && (
                        <CheckIcon width={35} height={35} color={colors.textColor}/>
                    )}
                </PressableHaptic>
            )
        }
        return jsx
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.help.language.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <View style={styles.container}>
                {generateOptionsJSX()}
            </View>
        </View>
    )
}

export default LanguageScreen