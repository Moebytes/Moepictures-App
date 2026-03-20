/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {ScrollView, View, Text, Pressable, Switch, Linking, StatusBar} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useNavigation} from "@react-navigation/native"
import {useThemeActions, useThemeSelector, useLayoutSelector, useSessionSelector, useSessionActions} from "../../store"
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
    const {i18n, theme, colors} = useThemeSelector()
    const {headerHeight, tabBarHeight} = useLayoutSelector()
    const {setTheme} = useThemeActions()
    const {showRelated} = useSessionSelector()
    const {setShowRelated} = useSessionActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const changeShowRelated = () => {
        setShowRelated(!showRelated)
    }

    let iconSize = 21
    let pressDelay = 100

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={{
                    ...styles.container,
                    paddingBottom: tabBarHeight + 20
                }}>
                <View style={styles.buttonContainer}>
                    <Pressable style={{...styles.itemContainer, backgroundColor: colors.profileLogin}}>
                        <View style={styles.iconContainer}>
                            <KeyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.loginText}>{i18n.navbar.login}</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.buttonContainer}>
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

                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("Language", undefined, {pop: true})} style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.help.language.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => navigation.navigate("AppColor", undefined, {pop: true})} style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.text}>{i18n.user.appColor}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

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
                </View>
                <View style={styles.buttonContainer}>
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <TOSIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.terms.tos.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <PrivacyIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.terms.privacy.title}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    style={({pressed}) => [styles.itemContainer, 
                    {backgroundColor: pressed ? colors.profileItemPressed : colors.profileItem}]}>
                        <View style={styles.iconContainer}>
                            <ContactIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Text style={styles.text}>{i18n.navbar.contact}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>

                    <View style={styles.separator}/>

                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
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
                    <PressableHaptic delayLongPress={pressDelay} onLongPress={() => null} 
                    onPress={() => Linking.openURL("https://moepictures.net")}
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