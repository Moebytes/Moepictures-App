/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {View, Text, TextInput, ImageBackground, Animated, StatusBar} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {SvgXml} from "react-native-svg"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useFlagActions, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import TokenIcon from "../../assets/svg/token.svg"
import functions from "../../functions/Functions"

const loginBG = require("../../assets/images/loginBG.jpg")

const $2FAScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const [token, setToken] = useState("")
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const submit = async () => {
        if (!token.trim()) {
            setError(i18n.pages.$2fa.badToken)
            await functions.timeout(2000)
            return setError("")
        }
        setError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/2fa", {token}, session)
            setSessionFlag(true)
            navigation.navigate("Profile", undefined, {pop: true})
            setError("")
        } catch {
            setError(i18n.pages.$2fa.badToken)
            await functions.timeout(2000)
            setError("")
        }
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 25

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.user.$2fa}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ImageBackground 
                source={loginBG} 
                style={styles.container}
                imageStyle={styles.containerBG}
                blurRadius={7}>
                <LiquidGlassView effect="clear" style={[styles.box, fallback]}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{i18n.pages.$2fa.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.pages.$2fa.heading}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <TokenIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.token}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={token}
                                onChangeText={setToken}
                                spellCheck={false}
                                keyboardType="numeric"/>
                        </View>
                    </View>
                    {error ? <Text style={styles.text2}>{error}</Text> : null}
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "100%"}} 
                        style={styles.wideButton} onPress={submit}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.buttons.validate}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View>
                </LiquidGlassView>
            </ImageBackground>
            <TabBar relative={true}/>
        </View>
    )
}

export default $2FAScreen