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
import {useFlagActions, useLayoutSelector, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import UserIcon from "../../assets/svg/user.svg"
import PassLockIcon from "../../assets/svg/passlock.svg"
import ShowIcon from "../../assets/svg/show.svg"
import HideIcon from "../../assets/svg/hide.svg"
import functions from "../../functions/Functions"

const loginBG = require("../../assets/images/loginBG.jpg")

const LoginScreen: React.FunctionComponent = () => {
    const {tablet} = useLayoutSelector()
    const {i18n, language, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors, tablet)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [captcha, setCaptcha] = useState("")
    const [captchaResponse, setCaptchaResponse] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const login = async () => {
        if (!captchaResponse.trim()) {
            setError(i18n.pages.login.captcha)
            await functions.timeout(2000)
            return setError("")
        }
        setError(i18n.buttons.submitting)
        try {
            const result = await functions.http.post("/api/user/login", {username, password, captchaResponse}, session)
            setSessionFlag(true)
            if (result === "2fa") {
                navigation.navigate("$2FA")
                return setError("")
            } else {
                navigation.navigate("Profile", undefined, {pop: true})
                setError("")
            }
        } catch (err: any) {
            let errMsg = i18n.pages.login.error
            if (err.message.includes("Too many requests")) errMsg = i18n.pages.login.rateLimit
            if (err.message.includes("new IP login location")) errMsg = i18n.pages.login.newIP
            setError(errMsg)
            await functions.timeout(3000)
            setError("")
            updateCaptcha()
        }
    }

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
    let showIcon = 20

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.navbar.login}</Text>
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
                        <Text style={styles.title}>{i18n.navbar.login}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.pages.login.signupText}</Text>
                        <ScalableHaptic scaleFactor={0.95} onPress={() => navigation.navigate("SignUp")}>
                            <Text style={styles.text2}>{i18n.pages.login.signupText2}</Text>
                        </ScalableHaptic>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <UserIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.username}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={username}
                                onChangeText={setUsername}
                                spellCheck={false}/>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <PassLockIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.password}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                spellCheck={false}/>

                            <PressableHaptic style={styles.inputIcon2}
                                onPress={() => setShowPassword(prev => !prev)}>
                                {showPassword ? 
                                <HideIcon width={showIcon} height={showIcon} color={colors.black}/> :
                                <ShowIcon width={showIcon} height={showIcon} color={colors.black}/>}
                            </PressableHaptic>
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
                        style={styles.wideButton} onPress={login}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.pages.login.button}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View>
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} 
                        onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text style={styles.text3}>{i18n.pages.login.forgotText}</Text>
                        </ScalableHaptic>
                    </View>
                </LiquidGlassView>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen