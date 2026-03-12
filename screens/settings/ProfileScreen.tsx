/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Pressable, Switch, StatusBar} from "react-native"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import {useThemeActions, useThemeSelector, useSessionSelector, useSessionActions} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import KeyIcon from "../../assets/svg/key.svg"
import TOSIcon from "../../assets/svg/tos.svg"
import PrivacyIcon from "../../assets/svg/privacy.svg"
import ContactIcon from "../../assets/svg/mail.svg"
import HelpIcon from "../../assets/svg/help.svg"
import RightIcon from "../../assets/svg/right.svg"
import LinkIcon from "../../assets/svg/link.svg"
import MoebytesLogo from "../../assets/svg/moebytes.svg"
import {createStylesheet} from "./styles/ProfileScreen.styles"

const ProfileScreen: React.FunctionComponent = () => {
    const {theme, colors} = useThemeSelector()
    const {setTheme} = useThemeActions()
    const {showRelated} = useSessionSelector()
    const {setShowRelated} = useSessionActions()
    const styles = createStylesheet(colors)

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const changeShowRelated = () => {
        setShowRelated(!showRelated)
    }

    const hapticFeedback = () => {
        ReactNativeHapticFeedback.trigger("rigid")
    }

    let iconSize = 21
    let pressDelay = 100

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: colors.mainColor}}>
                <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
                <TitleBar/>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <Pressable style={{...styles.itemContainer, backgroundColor: colors.profileLogin}}>
                            <View style={styles.iconContainer}>
                                <KeyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                                <Text style={styles.loginText}>Login</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.text}>Dark Theme</Text>
                            <Switch
                                value={theme === "dark"}
                                onValueChange={changeTheme}
                                thumbColor="#ffffff"
                                trackColor={{false: colors.switchOff, true: colors.switchOn}}
                                ios_backgroundColor={colors.switchOff}
                            />
                        </View>

                        <View style={styles.separator}/>

                        <View style={styles.itemContainer}>
                            <Text style={styles.text}>Show Related</Text>
                            <Switch
                                value={showRelated}
                                onValueChange={changeShowRelated}
                                thumbColor="#ffffff"
                                trackColor={{false: colors.switchOff, true: colors.switchOn}}
                                ios_backgroundColor={colors.switchOff}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable delayLongPress={pressDelay} onLongPress={hapticFeedback} 
                        style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                            <View style={styles.iconContainer}>
                                <TOSIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                                <Text style={styles.text}>Terms of Service</Text>
                            </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </Pressable>

                        <View style={styles.separator}/>

                        <Pressable delayLongPress={pressDelay} onLongPress={hapticFeedback} 
                        style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                            <View style={styles.iconContainer}>
                                <PrivacyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                                <Text style={styles.text}>Privacy Policy</Text>
                            </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </Pressable>

                        <View style={styles.separator}/>

                        <Pressable delayLongPress={pressDelay} onLongPress={hapticFeedback} 
                        style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                            <View style={styles.iconContainer}>
                                <ContactIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                                <Text style={styles.text}>Contact Us</Text>
                            </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </Pressable>

                        <View style={styles.separator}/>

                        <Pressable delayLongPress={pressDelay} onLongPress={hapticFeedback} 
                        style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                            <View style={styles.iconContainer}>
                                <HelpIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                                <Text style={styles.text}>Help</Text>
                            </View>
                            <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </Pressable>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable delayLongPress={pressDelay} onLongPress={hapticFeedback} 
                        style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                            <View style={styles.iconContainer}>
                                <LinkIcon width={25} height={25} color={colors.iconColor}/>
                                <Text style={styles.text}>Visit our website!</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={styles.copyContainer}>
                        <MoebytesLogo/>
                        <Text style={styles.copyText}>© 2026 Moebytes</Text>
                    </View>
                </View>
                <TabBar/>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default ProfileScreen