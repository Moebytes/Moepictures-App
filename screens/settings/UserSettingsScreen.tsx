/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Image, StatusBar} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useCacheSelector, useFlagActions, useSessionSelector, useThemeSelector, useMiscDialogActions, useMiscDialogSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import RightIcon from "../../assets/svg/right.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DangerIcon from "../../assets/svg/danger.svg"
import {createStylesheet} from "./styles/UserSettingsScreen.styles"
import moeText from "../../moetext/MoeText"

const UserSettingsScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {showBioDialog} = useMiscDialogSelector()
    const {setShowBioDialog} = useMiscDialogActions()
    const {emojis} = useCacheSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const editBio = async () => {
        setShowBioDialog(!showBioDialog)
    }

    const bioText = () => {
        let fragment = moeText.renderText(session.bio, emojis, colors)[0] as React.ReactElement<React.FragmentProps>
        const rendered = fragment.props.children as React.ReactElement[]
        return rendered.map((element: any, index: number) => {
            if (element.type === Text) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {fontSize: 20}]
                })
            }

            if (element.type === Image) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {width: 35, height: 35}]
                })
            }

            return element
        })
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.pages.userSettings.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.labelText}>{i18n.user.bio}</Text>
                        <ScalableHaptic onPress={editBio}>
                            <EditIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </ScalableHaptic>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.bioContainer}>
                        {bioText()}
                    </View>
                </View>
                <View style={styles.buttonContainer2}>
                    <PressableHaptic style={({pressed}) => [styles.itemContainer, 
                        {backgroundColor: pressed ? colors.profileItemPressed : colors.profileLogin}]}
                        onPress={() => navigation.navigate("DeleteAccount", undefined, {pop: true})}>
                        <View style={styles.iconContainer}>
                            <DangerIcon width={iconSize} height={iconSize} color={colors.dangerColor}/>
                            <Text style={styles.loginText}>{i18n.buttons.deleteAccount}</Text>
                        </View>
                        <RightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </PressableHaptic>
                </View>
            </View>
        </View>
    )
}

export default UserSettingsScreen