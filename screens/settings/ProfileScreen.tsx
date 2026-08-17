/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, { useEffect } from "react"
import {ScrollView, View, Text, Image, Switch, Linking, StatusBar, Platform} from "react-native"
import Alert from "@blazejkustra/react-native-alert"
import PressableHaptic from "../../ui/PressableHaptic"
import {useNavigation} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {useThemeActions, useThemeSelector, useLayoutSelector, 
useSessionSelector, useSessionActions, useFlagActions} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import KeyIcon from "../../assets/svg/key.svg"
import TOSIcon from "../../assets/svg/tos.svg"
import PrivacyIcon from "../../assets/svg/privacy.svg"
import ContactIcon from "../../assets/svg/mail.svg"
import HelpIcon from "../../assets/svg/help.svg"
import RightIcon from "../../assets/svg/right.svg"
import StarIcon from "../../assets/svg/premium-star.svg"
import LinkIcon from "../../assets/svg/link.svg"
import LogoutIcon from "../../assets/svg/logout.svg"
import MoebytesLogo from "../../assets/svg/moebytes.svg"
import {createStylesheet} from "./styles/ProfileScreen.styles"
import {siteURL} from "../../ui/site"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

const ProfileScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {tabBarHeight} = useLayoutSelector()
    const {setTheme} = useThemeActions()
    const {session, userImg, showRelated, autosearchInterval, lowPerformance,
    privateFavorites, privateTagFavorites, upscaledImages, showR18} = useSessionSelector()
    const {setShowRelated, setAutosearchInterval, setPrivateFavorites, setLowPerformance,
        setPrivateTagFavorites, setUpscaledImages, setShowR18} = useSessionActions()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    useEffect(() => {
        setSessionFlag(true)
    }, [])

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const changeShowRelated = async () => {
        setShowRelated(!showRelated)
        if (session.username) {
            await functions.http.post("/api/user/showrelated", null, session)
            setSessionFlag(true)
        }
    }

    const changeLowPerformance = async () => {
        if (lowPerformance) {
            setLowPerformance(false)
        } else {
            Alert.alert(i18n.contextMenu.lowPerformance, i18n.contextMenu.lowPerformanceInfo, [
                {text: i18n.buttons.cancel, style: "cancel"},
                {text: i18n.buttons.ok, style: "default", onPress: async () => {
                    setLowPerformance(true)
                }}
            ], {cancelable: true})
        }
    }

    const changeAutosearchInterval = async () => {
        Alert.prompt(i18n.user.autosearchInterval, i18n.contextMenu.enterInterval, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.ok, onPress: async (value?: string) => {
                const num = functions.util.safeNumber(value)
                if (!num) return

                setAutosearchInterval(num)

                if (session.username) {
                    await functions.http.post("/api/user/autosearchinterval", {interval: num}, session)
                    setSessionFlag(true)
                }
            }}
        ], "plain-text", String(autosearchInterval), "numeric", {cancelable: true})
    }

    const changePrivateFavorites = async () => {
        setPrivateFavorites(!privateFavorites)
        await functions.http.post("/api/user/favoritesprivacy", null, session)
        setSessionFlag(true)
    }

    const changePrivateTagFavorites = async () => {
        setPrivateTagFavorites(!privateTagFavorites)
        await functions.http.post("/api/user/tagfavoritesprivacy", null, session)
        setSessionFlag(true)
    }

    const changeUpscaledImages = async () => {
        if (!permissions.isPremium(session)) {
            Toast.show({text1: i18n.toast.premiumRequired})
        } else {
            setUpscaledImages(!upscaledImages)
            await functions.http.post("/api/user/upscaledimages", null, session)
            setSessionFlag(true)
        }
    }

    const changeShowR18 = async () => {
        let newValue = !showR18

        setShowR18(newValue)
        await functions.http.post("/api/user/r18", {r18: newValue}, session)
        setSessionFlag(true)
    }

    const changeUsername = async () => {
        if (!permissions.isPremium(session)) {
            Toast.show({text1: i18n.toast.premiumRequired})
        } else {
            navigation.navigate("ChangeUsername", undefined, {pop: true})
        }
    }

    const logout = async () => {
        Alert.alert(i18n.labels.logout, i18n.contextMenu.logout, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.labels.logout, style: "destructive", onPress: async () => {
                await functions.http.post("/api/user/logout", null, session)
                functions.http.privateKey = ""
                functions.http.privateKeyLock = false
                setSessionFlag(true)
                Toast.show({text1: i18n.toast.loggedOut})
            }}
        ], {cancelable: true})
    }

    let iconSize = 21
    let pressDelay = 100

    let offset = Platform.OS === "android" ? 175 : 0

    return (
        <View style={{flex: 1, position: "relative", backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={{
                    ...styles.container,
                    paddingBottom: tabBarHeight + 20 - offset
                }}>

                /* Banned Text */
                {session.banned ? <View style={{flexDirection: "row", width: "100%", marginLeft: 10}}>
                    <Text style={styles.banText}>{i18n.user.ban}</Text>
                </View> : null}

                <View style={styles.buttonContainer}>
                    {session.username ? 
                    /* Profile Picture */
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileLogin}]}
                        onPress={() => navigation.navigate("UserSettings", undefined, {pop: true})}>
                        <View style={styles.iconContainer}>
                            <Image src={userImg} style={styles.pfp}/>
                            {functions.jsx.usernameJSX(session, colors, i18n, navigation, {fontSize: 22}, 25,
                                undefined, undefined, undefined, false)}
                        </View>
                    </PressableHaptic> : 
                    /* Login */
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileLogin}]}
                        onPress={() => navigation.navigate("Login", undefined, {pop: true})}>
                        <View style={styles.iconContainer}>
                            <KeyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.loginText}>{i18n.navbar.login}</Text>
                        </View>
                    </PressableHaptic>}
                </View>

                {session.username && !session.emailVerified ? <View style={styles.buttonContainer}>
                    /* Verify Email */
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileEmailPressed : colors.profilePremium}]}
                        onPress={() => navigation.navigate("VerifyEmail", undefined, {pop: true})}>
                        <View style={styles.iconContainer}>
                            <ContactIcon width={iconSize} height={iconSize} color={colors.tagColor}/>
                            <Text style={[styles.premiumText, {color: colors.tagColor}]}>{i18n.pages.verifyEmail.title}</Text>
                        </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.tagColor}/>
                    </PressableHaptic>
                </View> : null}

                {session.username ? <View style={styles.buttonContainer}>
                    /* Premium */
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profilePremiumPressed : colors.profilePremium}]}
                        onPress={() => navigation.navigate("Premium", undefined, {pop: true})}>
                        <View style={styles.iconContainer}>
                            <StarIcon width={iconSize} height={iconSize} color={colors.premiumColor}/>
                            <Text style={styles.premiumText}>{session.premium ? 
                                `${i18n.user.premiumUntil} ${functions.date.compactDate(session.premiumExpiration!)}` : 
                                `${i18n.premium.premium.title}`}</Text>
                        </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.premiumColor}/>
                    </PressableHaptic>
                </View> : null}

                {session.username ? <View style={styles.buttonContainer}>
                    /* Logout */
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileLogin}]}
                        onPress={logout}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.loginText}>{i18n.labels.logout}</Text>
                        </View>
                            <LogoutIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>
                </View> : null}
                <View style={styles.buttonContainer}>
                    /* Dark Theme */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.darkTheme}</Text>
                        <Switch
                            value={theme === "dark"}
                            onValueChange={changeTheme}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View>

                    <View style={styles.separator}/>

                    /* Language */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Language", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.help.language.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* App Color */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("AppColor", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.appColor}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Show Related */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.showRelated}</Text>
                        <Switch
                            value={showRelated}
                            onValueChange={changeShowRelated}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View>

                    <View style={styles.separator}/>

                    /* Autosearch Interval */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={changeAutosearchInterval} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.autosearchInterval}</Text>
                        </View>
                        <Text style={styles.text}>{autosearchInterval}</Text>
                    </PressableHaptic>

                    {session.username ? <>
                    <View style={styles.separator}/>

                    /* Private Favorites */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.privateFavorites}</Text>
                        <Switch
                            value={privateFavorites}
                            onValueChange={changePrivateFavorites}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View></> : null}

                    {session.username ? <>
                    <View style={styles.separator}/>

                    /* Private Tag Favorites */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.privateTagFavorites}</Text>
                        <Switch
                            value={privateTagFavorites}
                            onValueChange={changePrivateTagFavorites}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View></> : null}

                    {session.username ? <>
                    <View style={styles.separator}/>

                    /* Upscaled Images */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.upscaledImages}</Text>
                        <Switch
                            value={upscaledImages}
                            onValueChange={changeUpscaledImages}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View></> : null}

                    {permissions.isOwner(session) ? <>
                    <View style={styles.separator}/>

                    /* Show R18 */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.user.showR18}</Text>
                        <Switch
                            value={showR18}
                            onValueChange={changeShowR18}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View></> : null}

                    <View style={styles.separator}/>
                    
                    /* Low Performance */
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>{i18n.contextMenu.lowPerformance}</Text>
                        <Switch
                            value={lowPerformance}
                            onValueChange={changeLowPerformance}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View>
                </View>

                {session.username ? 
                <View style={styles.buttonContainer}>
                    /* Favorite Groups */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Favgroups", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.help.favoriteGroups.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                </View> : null}

                {session.username ? 
                <View style={styles.buttonContainer}>
                    /* Change Usernmae */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => changeUsername()} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.changeUsername}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Change Email */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("ChangeEmail", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.changeEmail}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Change Password */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("ChangePassword", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.changePassword}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>
                </View> : null}

                <View style={styles.buttonContainer}>
                    /* Terms of Service */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Terms", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <TOSIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.terms.tos.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Privacy Policy */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Privacy", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <PrivacyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.terms.privacy.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Contact */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Contact", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <ContactIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.navbar.contact}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    /* Help */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null}
                    onPress={() => navigation.navigate("Help", undefined, {pop: true})} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <HelpIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.navbar.help}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>
                </View>
                <View style={styles.buttonContainer}>
                    /* Visit our Website */
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => Linking.openURL(siteURL)}
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <LinkIcon width={25} height={25} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.user.visitWebsite}</Text>
                        </View>
                    </PressableHaptic>
                </View>
                <View style={styles.copyContainer}>
                    {/* <MoebytesLogo/> */}
                    <View style={styles.textContainer}>
                        <Text style={styles.textA}>M</Text>
                        <Text style={styles.textB}>o</Text>
                        <Text style={styles.textA}>e</Text>
                        <Text style={styles.textB}>p</Text>
                        <Text style={styles.textA}>i</Text>
                        <Text style={styles.textB}>c</Text>
                        <Text style={styles.textA}>t</Text>
                        <Text style={styles.textB}>u</Text>
                        <Text style={styles.textA}>r</Text>
                        <Text style={styles.textB}>e</Text>
                        <Text style={styles.textA}>s</Text>
                    </View>
                    <Text style={styles.copyText}>© 2026 Moepictures</Text>
                </View>
            </ScrollView>
            <TabBar/>
        </View>
    )
}

export default ProfileScreen