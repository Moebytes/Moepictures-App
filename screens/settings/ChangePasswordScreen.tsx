/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {View, Text, TextInput, ImageBackground, Animated, StatusBar} from "react-native"
import {useNavigation} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useFlagActions, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/LoginScreen.styles"
import PassLockIcon from "../../assets/svg/passlock.svg"
import ShowIcon from "../../assets/svg/show.svg"
import HideIcon from "../../assets/svg/hide.svg"
import functions from "../../functions/Functions"

const loginBG = require("../../assets/images/loginBG.jpg")

const ChangePasswordScreen: React.FunctionComponent = () => {
    const {i18n, language, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [error, setError] = useState("")
    const navigation = useNavigation()

    const changePassword = async () => {
        if (newPassword.trim() !== confirmNewPassword.trim()) {
            setError(i18n.pages.changePassword.noMatch)
            await functions.timeout(2000)
            return setError("")
        }
        const badPassword = functions.valid.validatePassword(session.username.trim(), newPassword.trim(), i18n)
        if (badPassword) {
            setError(badPassword)
            await functions.timeout(2000)
            return setError("")
        }
        setError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/user/changepassword", {oldPassword, newPassword}, session)
            navigation.navigate("Profile", undefined, {pop: true})
            Toast.show({text1: i18n.pages.changePassword.submitHeading})
            setError("")
        } catch (err: any) {
            let errMsg = i18n.pages.changePassword.error
            setError(errMsg)
            await functions.timeout(2000)
            setError("")
        }
    }

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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.user.changePassword}</Text>
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
                        <Text style={styles.title}>{i18n.user.changePassword}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <PassLockIcon width={iconSize} height={iconSize} color={colors.black} style={styles.inputIcon}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder={i18n.labels.oldPassword}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showOldPassword}
                                spellCheck={false}/>

                            <PressableHaptic style={styles.inputIcon2}
                                onPress={() => setShowOldPassword(prev => !prev)}>
                                {showOldPassword ? 
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
                                placeholder={i18n.labels.newPassword}
                                placeholderTextColor={colors.black}
                                selectionColor={colors.borderColor}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                spellCheck={false}/>

                            <PressableHaptic style={styles.inputIcon2}
                                onPress={() => setShowNewPassword(prev => !prev)}>
                                {showNewPassword ? 
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
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                                secureTextEntry={!showConfirmNewPassword}
                                spellCheck={false}/>

                            <PressableHaptic style={styles.inputIcon2}
                                onPress={() => setShowConfirmNewPassword(prev => !prev)}>
                                {showConfirmNewPassword ? 
                                <HideIcon width={showIcon} height={showIcon} color={colors.black}/> :
                                <ShowIcon width={showIcon} height={showIcon} color={colors.black}/>}
                            </PressableHaptic>
                        </View>
                    </View>
                    {error ? <Text style={styles.text2}>{error}</Text> : null}
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "100%"}} 
                        style={styles.wideButton} onPress={changePassword}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.user.changePassword}
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

export default ChangePasswordScreen