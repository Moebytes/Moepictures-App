/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, ScrollView, Text, StatusBar} from "react-native"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import PrivacyIcon from "../../assets/svg/privacy.svg"
import TabBar from "../../components/app/TabBar"
import {createStylesheet} from "./styles/TermsOfServiceScreen.styles"

const PrivacyPolicyScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.terms.privacy.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <PrivacyIcon width={30} height={30} color={colors.iconColor}/>
                        <Text style={styles.title}>{i18n.terms.privacy.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.terms.tos.lastUpdated}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.header1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.accountRelated.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.accountRelated.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.submittedContent.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.submittedContent.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.cookies.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.cookies.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.informationUse.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.boxContainer}>
                            <Text style={styles.text}>
                                {i18n.terms.privacy.informationUse.line1}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.informationUse.bullet1}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.informationUse.bullet2}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.informationUse.bullet3}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.informationUse.bullet4}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.sharingInformation.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.boxContainer}>
                            <Text style={styles.text}>
                                {i18n.terms.privacy.sharingInformation.line1}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.sharingInformation.bullet1}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.sharingInformation.bullet2}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.privacy.sharingInformation.bullet3}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.accountDeletion.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.accountDeletion.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.privacy.changes.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.privacy.changes.line1}
                        </Text>
                    </View>
                </View>
                <TabBar relative={true}/>
            </ScrollView>
        </View>
    )
}

export default PrivacyPolicyScreen