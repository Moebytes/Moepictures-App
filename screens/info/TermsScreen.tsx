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
import TermsIcon from "../../assets/svg/tos.svg"
import TabBar from "../../components/app/TabBar"
import {createStylesheet} from "./styles/TermsScreen.styles"

const TermsOfServiceScreen: React.FunctionComponent = () => {
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.terms.tos.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <TermsIcon width={30} height={30} color={colors.iconColor}/>
                        <Text style={styles.title}>{i18n.terms.tos.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.terms.tos.lastUpdated}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.header1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.header2}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.ageRestriction.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.ageRestriction.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            <Text style={styles.textAlt}>{i18n.sortbar.rating.cute}</Text>{i18n.terms.tos.ageRestriction.cuteRating}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            <Text style={styles.textAlt}>{i18n.sortbar.rating.sexy}</Text>{i18n.terms.tos.ageRestriction.sexyRating}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            <Text style={styles.textAlt}>{i18n.sortbar.rating.erotic}</Text>{i18n.terms.tos.ageRestriction.eroticRating}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.ageRestriction.line2}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.animeOnly.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.animeOnly.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.animeOnly.line2}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.spam.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.spam.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.spam.line2}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.harassment.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.harassment.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.vandalism.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.vandalism.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.userContent.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.userContent.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.userContent.line2}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.copyrightDMCA.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.copyrightDMCA.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.boxContainer}>
                            <Text style={styles.text}>
                                {i18n.terms.tos.copyrightDMCA.line2}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.tos.copyrightDMCA.bullet1}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.tos.copyrightDMCA.bullet2}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.boxContainer}>
                            <Text style={styles.text}>
                                {i18n.terms.tos.copyrightDMCA.line3}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.tos.copyrightDMCA.bullet3}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.tos.copyrightDMCA.bullet4}
                            </Text>
                            <Text style={styles.textAlt}>
                                {i18n.terms.tos.copyrightDMCA.bullet5}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.scraping.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.scraping.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.maliciousActivity.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.maliciousActivity.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.accounts.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.accounts.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.accountTermination.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.accountTermination.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.liability.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.liability.line1}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            {i18n.terms.tos.changes.title}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.terms.tos.changes.line1}
                        </Text>
                    </View>
                </View>
                <TabBar relative={true}/>
            </ScrollView>
        </View>
    )
}

export default TermsOfServiceScreen