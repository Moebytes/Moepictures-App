/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, StatusBar} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import Alert from "@blazejkustra/react-native-alert"
import Toast from "react-native-toast-message"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useCacheSelector, useFlagActions, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import DangerIcon from "../../assets/svg/danger.svg"
import {createStylesheet} from "./styles/UserSettingsScreen.styles"
import functions from "../../functions/Functions"

const DeleteAccountScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const deleteAccount = async () => {
        let msg = i18n.dialogs.deleteAccount.header + "\n\n" +
            i18n.dialogs.deleteAccount.header2 + "\n\n" +
            i18n.dialogs.deleteAccount.header3

        Alert.alert(i18n.buttons.deleteAccount, msg, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.continue, style: "destructive", onPress: async () => {
                Alert.prompt(i18n.buttons.deleteAccount, i18n.dialogs.deleteAccount.confirmation, [
                    {text: i18n.buttons.cancel, style: "cancel"},
                    {text: i18n.buttons.deleteAccount, style: "destructive", onPress: async (value?: string) => {
                        if (value?.trim().toLowerCase() !== "delete") {
                            return Toast.show({text1: i18n.toast.deletedAccountFailure})
                        }
                        
                        await functions.http.delete("/api/user/delete", null, session)
                        functions.http.privateKey = ""
                        functions.http.privateKeyLock = false
                        setSessionFlag(true)
                        navigation.navigate("Profile", undefined, {pop: true})
                        Toast.show({text1: i18n.toast.deletedAccount})
                    }}
                ], "plain-text", "", "default", {cancelable: true})
            }}
        ], {cancelable: true})
    }

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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.buttons.deleteAccount}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.dangerText}>{i18n.pages.userSettings.dangerZone}</Text>
                </View>
                <View style={styles.separator}/>
                <PressableHaptic onPress={deleteAccount}
                    style={({pressed}) => [styles.buttonContainer, pressed && styles.activeButtonContainer]}>
                    <View style={styles.iconContainer}>
                        <DangerIcon width={iconSize} height={iconSize} color={colors.dangerColor}/>
                        <Text style={styles.buttonText}>{i18n.buttons.deleteAccount}</Text>
                    </View>
                </PressableHaptic>
            </View>
        </View>
    )
}

export default DeleteAccountScreen