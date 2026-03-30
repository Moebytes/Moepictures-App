/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, ScrollView, Text, TextInput, Animated, StatusBar, Linking} from "react-native"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import ContactIcon from "../../assets/svg/mail.svg"
import TabBar from "../../components/app/TabBar"
import {createStylesheet} from "./styles/TermsScreen.styles"

const ContactScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const sendMessage = async () => {
        if (!subject) return
        if (!message) return
        let url = `mailto:${i18n.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
        await Linking.openURL(url)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.navbar.contact}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.container, {height: "100%"}]}>
                    <View style={styles.row}>
                        <ContactIcon width={30} height={30} color={colors.iconColor}/>
                        <Text style={styles.title}>{i18n.navbar.contact}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.pages.contact.heading}{" "}
                            <ScalableHaptic scaleFactor={0.97}
                            onPress={() => navigation.navigate("Copyright", undefined, {pop: true})}>
                                <Text style={styles.textAltBold}>{i18n.pages.contact.copyrightForm}</Text>
                            </ScalableHaptic>
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bigText}>{i18n.labels.subject}:</Text>
                        <TextInput
                            style={styles.textInput}
                            selectionColor={colors.borderColor}
                            value={subject}
                            onChangeText={setSubject}/>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bigText}>{i18n.buttons.message}:</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.messageInput}
                            selectionColor={colors.borderColor}
                            value={message}
                            onChangeText={setMessage}
                            multiline={true}
                            textAlignVertical="top"/>
                    </View>
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.98} style={styles.wideButton} onPress={sendMessage}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.black, colors.white],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.labels.sendMessage}
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

export default ContactScreen