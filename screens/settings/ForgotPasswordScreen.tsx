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
import {useSessionSelector, useLayoutSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import EmailIcon from "../../assets/svg/email.svg"
import functions from "../../functions/Functions"

const loginBG = require("../../assets/images/loginBG.jpg")

const ForgotPasswordScreen: React.FunctionComponent = () => {
    const {tablet} = useLayoutSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors, tablet)
    const [email, setEmail] = useState("")
    const [captcha, setCaptcha] = useState("")
    const [captchaResponse, setCaptchaResponse] = useState("")
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const submit = async () => {
        setError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/user/forgotpassword", {email, captchaResponse}, session)
            navigation.navigate("Profile", undefined, {pop: true})
            Toast.show({text1: i18n.pages.forgotPassword.submitHeading})
            setError("")
        } catch (err: any) {
            setError(i18n.pages.forgotPassword.error)
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

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.pages.forgotPassword.title}</Text>
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
                        <Text style={styles.title}>{i18n.pages.forgotPassword.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.pages.forgotPassword.heading}</Text>
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
                        style={styles.wideButton} onPress={submit}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.buttons.sendLink}
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

export default ForgotPasswordScreen