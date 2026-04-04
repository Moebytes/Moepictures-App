/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {View, Text, TextInput, ImageBackground, Animated, StatusBar} from "react-native"
import {useNavigation} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {SvgXml} from "react-native-svg"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useFlagActions, useLayoutSelector, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import UserIcon from "../../assets/svg/user.svg"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

const loginBG = require("../../assets/images/loginBG.jpg")

const ChangeUsernameScreen: React.FunctionComponent = () => {
    const {tablet} = useLayoutSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors, tablet)
    const [username, setUsername] = useState("")
    const [captcha, setCaptcha] = useState("")
    const [captchaResponse, setCaptchaResponse] = useState("")
    const [timeRemaining, setTimeRemaining] = useState("")
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const changeUsername = async () => {
        if (!captchaResponse.trim()) {
            setError(i18n.pages.login.captcha)
            await functions.timeout(2000)
            return setError("")
        }
        const badUsername = functions.valid.validateUsername(username, i18n)
        if (badUsername) {
            setError(badUsername)
            await functions.timeout(2000)
            return setError("")
        }
        setError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/user/changeusername", {newUsername: username, captchaResponse}, session)
            setSessionFlag(true)
            navigation.navigate("Profile", undefined, {pop: true})
            Toast.show({text1: i18n.pages.changeUsername.submitHeading})
            setError("")
        } catch (err: any) {
            let errMsg = i18n.pages.changeUsername.error
            if (err.message.includes("Changing username too frequently")) errMsg = i18n.pages.changeUsername.rateLimit
            setError(errMsg)
            await functions.timeout(2000)
            setError("")
            updateCaptcha()
        }
    }

    useEffect(() => {
        if (!permissions.isAdmin(session) && session.lastNameChange) {
            let timeDiff = new Date().getTime() - new Date(session.lastNameChange).getTime()
            if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
                const timeRemaining = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000 - timeDiff)).toISOString()
                return setTimeRemaining(timeRemaining)
            }
        }
        setTimeRemaining("")
    }, [session])

    const updateCaptcha = async () => {
        const data = await functions.http.get("/api/misc/captcha/create", {color: colors.white}, session)
        setCaptcha(data.captcha)
        setCaptchaResponse("")
    }

    useEffect(() => {
        updateCaptcha()
    }, [session, theme])

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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.user.changeUsername}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ImageBackground 
                source={loginBG} 
                style={styles.container}
                imageStyle={styles.containerBG}
                blurRadius={tablet ? 2 : 7}>
                <LiquidGlassView effect="clear" style={[styles.box, fallback]}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{i18n.user.changeUsername}</Text>
                    </View>
                    <View style={styles.row}>
                        {timeRemaining ? <>
                        <Text style={styles.text}>{i18n.pages.changeUsername.changeIn}</Text>
                        <Text style={styles.text2}>{functions.date.timeUntil(timeRemaining, i18n)}</Text></> :
                        <Text style={styles.text}>{i18n.pages.changeUsername.heading}</Text>}
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.headerText}>{i18n.labels.username}:</Text>
                        <Text style={styles.headerText2}>{session.username}</Text>
                    </View>
                    {!timeRemaining ? <>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <UserIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.newUsername}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={username}
                                onChangeText={setUsername}
                                spellCheck={false}/>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.captchaWrapper}>
                            {captcha && <SvgXml xml={captcha} width="100%" height={80}/>}
                            <TextInput 
                                style={styles.captchaInput}
                                selectionColor={colors.borderColor}
                                value={captchaResponse}
                                onChangeText={setCaptchaResponse}
                                spellCheck={false}
                                autoCorrect={false}/>
                        </View>
                    </View>
                    {error ? <Text style={styles.text2}>{error}</Text> : null}
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "100%"}} 
                        style={styles.wideButton} onPress={changeUsername}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.user.changeUsername}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View></> : null}
                </LiquidGlassView>
            </ImageBackground>
        </View>
    )
}

export default ChangeUsernameScreen