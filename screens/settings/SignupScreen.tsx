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
import {useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import EmailIcon from "../../assets/svg/email.svg"
import UserIcon from "../../assets/svg/user.svg"
import PassLockIcon from "../../assets/svg/passlock.svg"
import ShowIcon from "../../assets/svg/show.svg"
import HideIcon from "../../assets/svg/hide.svg"
import functions from "../../functions/Functions"

const loginBG = require("../../assets/images/loginBG.jpg")

const SignupScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [captcha, setCaptcha] = useState("")
    const [captchaResponse, setCaptchaResponse] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const signup = async () => {
        if (!captchaResponse.trim()) {
            setError(i18n.pages.login.captcha)
            await functions.timeout(2000)
            return setError("")
        }
        if (password.trim() !== confirmPassword.trim()) {
            setError(i18n.pages.changePassword.noMatch)
            await functions.timeout(2000)
            return setError("")
        }
        const badPassword = functions.valid.validatePassword(username.trim(), password.trim(), i18n)
        if (badPassword) {
            setError(badPassword)
            await functions.timeout(2000)
            return setError("")
        }
        const badEmail = functions.valid.validateEmail(email.trim(), i18n)
        if (badEmail) {
            setError(badEmail)
            await functions.timeout(2000)
            return setError("")
        }
        const badUsername = functions.valid.validateUsername(username.trim(), i18n)
        if (badUsername) {
            setError(badUsername)
            await functions.timeout(2000)
            return setError("")
        }
        setError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/user/signup", {username, email, password, captchaResponse}, session)
            navigation.navigate("Profile", undefined, {pop: true})
            Toast.show({text1: i18n.pages.signup.submitHeading})
            setError("")
        } catch (err: any) {
            let errMsg = i18n.pages.signup.error
            if (err.message.includes("Too many accounts created")) errMsg = i18n.pages.signup.rateLimit
            if (err.message.includes("IP banned")) errMsg = i18n.pages.signup.banned
            setError(errMsg)
            await functions.timeout(2000)
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.pages.signup.title}</Text>
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
                        <Text style={styles.title}>{i18n.pages.signup.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.pages.signup.loginText}</Text>
                        <ScalableHaptic scaleFactor={0.95} onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.text2}>{i18n.pages.signup.loginText2}</Text>
                        </ScalableHaptic>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <EmailIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.email}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={email}
                                onChangeText={setEmail}
                                spellCheck={false}/>
                        </View>
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
                        <View style={styles.inputWrapper}>
                            <PassLockIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.confirmPassword}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                spellCheck={false}/>

                            <PressableHaptic style={styles.inputIcon2}
                                onPress={() => setShowConfirmPassword(prev => !prev)}>
                                {showConfirmPassword ? 
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
                        style={styles.wideButton} onPress={signup}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.pages.signup.title}
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

export default SignupScreen