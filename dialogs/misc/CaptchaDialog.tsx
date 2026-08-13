/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import CrossLiquidGlassView from "../../ui/CrossLiquidGlassView"
import {View, Text, TextInput, Keyboard} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {SvgXml} from "react-native-svg"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import Draggable from "../Draggable"
import functions from "../../functions/Functions"

const CaptchaDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const [needsVerification, setNeedsVerification] = useState(false)
    const [captchaResponse, setCaptchaResponse] = useState("")
    const [captcha, setCaptcha] = useState("")
    const [error, setError] = useState("")
    const [ignored, setIgnored] = useState(false)
    const styles = createStylesheet(colors)

    const updateCaptcha = async () => {
        const data = await functions.http.get("/api/misc/captcha/create", {color: colors.background}, session)
        setCaptcha(data.captcha)
        setCaptchaResponse("")
    }

    useEffect(() => {
        if (needsVerification) updateCaptcha()
    }, [session, needsVerification])

    useEffect(() => {
        if (!session.cookie) return
        if (ignored) return setNeedsVerification(false)
        if (session.captchaNeeded) {
            if (!needsVerification) setNeedsVerification(true)
        } else {
            if (needsVerification) setNeedsVerification(false)
        }
    }, [session, ignored])

    const onSubmit = async () => {
        if (!captchaResponse.trim()) {
            setError(i18n.pages.login.captcha)
            await functions.timeout(2000)
            return setError("")
        }
        try {
            await functions.http.post("/api/misc/captcha", {captchaResponse}, session)
            setIgnored(false)
            onClose()
            setError("")
        } catch (err: any) {
            let errMsg = i18n.dialogs.captcha.error
            setError(errMsg)
            await functions.timeout(2000)
            setError("")
            updateCaptcha()
        }
    }

    const ignore = () => {
        setIgnored(true)
        onClose()
    }

    const onClose = () => {
        setCaptchaResponse("")
        setNeedsVerification(false)
        Keyboard.dismiss()
    }

    if (needsVerification) {
        return (
            <View style={styles.overlay}>
                <Draggable resetKey={needsVerification}>{(panHandlers) => (
                    <CrossLiquidGlassView effect="clear" style={[styles.container]}>
                        <View {...panHandlers} style={[styles.row, 
                            {paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.dialogs.captcha.title}</Text>
                        </View>
                        <View style={[styles.row, {width: 300}]}>
                            <Text style={styles.miniText}>{i18n.dialogs.captcha.header}</Text>
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
                        <View style={[styles.row, {width: "100%", justifyContent: "space-evenly"}]}>
                            <PressableHaptic onPress={ignore} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.ignore}</Text>
                            )}
                            </PressableHaptic>

                            <PressableHaptic onPress={onSubmit} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.solve}</Text>
                            )}
                            </PressableHaptic>
                        </View>
                    </CrossLiquidGlassView>
                )}</Draggable>
            </View>
        )
    }

    return null
}

export default CaptchaDialog