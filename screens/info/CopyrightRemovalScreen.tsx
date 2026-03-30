/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, ScrollView, Text, TextInput, Animated, StatusBar, Linking} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {stripIndents} from "common-tags"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import CopyrightIcon from "../../assets/svg/takedown.svg"
import CheckboxIcon from "../../assets/svg/checkbox.svg"
import CheckboxCheckedIcon from "../../assets/svg/checkbox-checked.svg"
import TabBar from "../../components/app/TabBar"
import {createStylesheet} from "./styles/TermsScreen.styles"

const CopyrightRemovalScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const [name, setName] = useState("")
    const [artistTag, setArtistTag] = useState("")
    const [socialMediaLinks, setSocialMediaLinks] = useState("")
    const [postLinks, setPostLinks] = useState("")
    const [proofLinks, setProofLinks] = useState("")
    const [attestOwnership, setAttestOwnership] = useState(false)
    const [removeAllRequest, setRemoveAllRequest] = useState(false)

    const sendRemovalRequest = async () => {
        if (!name) return
        if (!artistTag) return
        if (!attestOwnership) return
        
        let removalType = removeAllRequest 
            ? "I would like all of my associated content to be removed." 
            : "I would like all of the provided links to be removed."

        let subject = `Copyright Removal Request from ${artistTag}`

        let message = stripIndents`
            Artist Tag: ${artistTag}

            Social Media Links:
            ${socialMediaLinks}

            ${removeAllRequest ? "Artist Tag Link:" : "Post Links:"}
            ${postLinks}

            Proof Links:
            ${proofLinks ? proofLinks : "Please attach to this email."}

            ${removalType}

            *I am the copyright owner of the content linked above or am authorized 
            to act on the behalf of the copyright owner.

            Signature: ${name}
        `

        let url = `mailto:${i18n.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
        await Linking.openURL(url)
    }

    const removalTypeJSX = () => {
        if (removeAllRequest) {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.textAlt}>
                        {i18n.pages.copyrightRemoval.artistTagPageHeading}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bigText}>{i18n.pages.copyrightRemoval.artistTagPage}:</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={postLinks}
                        onChangeText={setPostLinks}/>
                </View>
                </>
            )
        } else {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.textAlt}>
                        {i18n.pages.copyrightRemoval.postLinkHeading}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bigText}>{i18n.pages.copyrightRemoval.postLinks}:</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.messageInput}
                        selectionColor={colors.borderColor}
                        value={postLinks}
                        onChangeText={setPostLinks}
                        multiline={true}
                        textAlignVertical="top"/>
                </View>
                </>
            )
        }
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.pages.copyrightRemoval.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <CopyrightIcon width={30} height={30} color={colors.iconColor}/>
                        <Text style={styles.title}>{i18n.pages.copyrightRemoval.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {i18n.pages.copyrightRemoval.heading}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bigText}>{i18n.labels.name}:</Text>
                        <TextInput
                            style={styles.textInput}
                            selectionColor={colors.borderColor}
                            value={name}
                            onChangeText={setName}/>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.textAlt}>
                            {i18n.pages.copyrightRemoval.artistTagHeading}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bigText}>{i18n.pages.upload.artistTag}:</Text>
                        <TextInput
                            style={styles.textInput}
                            selectionColor={colors.borderColor}
                            value={artistTag}
                            onChangeText={setArtistTag}/>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.textAlt}>
                            {i18n.pages.copyrightRemoval.socialMediaHeading}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bigText}>{i18n.pages.copyrightRemoval.socialMedia}:</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.messageInput}
                            selectionColor={colors.borderColor}
                            value={socialMediaLinks}
                            onChangeText={setSocialMediaLinks}
                            multiline={true}
                            textAlignVertical="top"/>
                    </View>
                    <View style={styles.row}>
                        <PressableHaptic onPress={() => setRemoveAllRequest(false)}>
                            {removeAllRequest ?
                            <CheckboxIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                            <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                        </PressableHaptic>
                        <Text style={styles.text}>{i18n.pages.copyrightRemoval.removeSpecified}</Text>
                    </View>
                    <View style={styles.row}>
                        <PressableHaptic onPress={() => setRemoveAllRequest(true)}>
                            {removeAllRequest ?
                            <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                            <CheckboxIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                        </PressableHaptic>
                        <Text style={styles.text}>{i18n.pages.copyrightRemoval.removeAll}</Text>
                    </View>
                    {removalTypeJSX()}
                    <View style={styles.row}>
                        <View style={styles.boxContainer}>
                            <Text style={styles.text}>
                                {i18n.pages.copyrightRemoval.proofHeading}
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
                        <Text style={styles.bigText}>{i18n.pages.copyrightRemoval.proof}:</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.messageInput}
                            selectionColor={colors.borderColor}
                            value={proofLinks}
                            onChangeText={setProofLinks}
                            multiline={true}
                            textAlignVertical="top"/>
                    </View>
                    <View style={styles.row}>
                        <PressableHaptic onPress={() => setAttestOwnership((prev: boolean) => !prev)}>
                            {attestOwnership ?
                            <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                            <CheckboxIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                        </PressableHaptic>
                        <View style={{width: "90%"}}>
                            <Text style={styles.miniText}>{"* "}{i18n.pages.copyrightRemoval.verifyCopyright}</Text>
                        </View>
                    </View>
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.98} style={styles.wideButton} onPress={sendRemovalRequest}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.black, colors.white],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.pages.copyrightRemoval.submit}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View>
                </View>
                <TabBar relative={true}/>
            </ScrollView>
        </View>
    )
}

export default CopyrightRemovalScreen