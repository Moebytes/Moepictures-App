/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, ScrollView, ImageBackground, Animated, StatusBar} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useFlagActions, useLayoutSelector, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import StarIcon from "../../assets/svg/premium-star.svg"
import UpscaledImagesIcon from "../../assets/svg/waifu2x.svg"
import SearchHistoryIcon from "../../assets/svg/searchhistory.svg"
import FavoriteGroupsIcon from "../../assets/svg/stargroup.svg"
import AutoSearchIcon from "../../assets/svg/autosearch2.svg"
import BookmarkSortIcon from "../../assets/svg/bookmarksort.svg"
import ChangeUsernameIcon from "../../assets/svg/changeusername.svg"
import RadioButtonIcon from "../../assets/svg/radiobutton.svg"
import RadioButtonCheckedIcon from "../../assets/svg/radiobutton-checked.svg"
import {createStylesheet} from "./styles/PremiumScreen.styles"

const premiumBG = require("../../assets/images/premiumBG.jpg")

const PremiumScreen: React.FunctionComponent = () => {
    const {tablet} = useLayoutSelector()
    const {i18n, language, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors, tablet)
    const [activePlan, setActivePlan] = useState("yearly")
    const navigation = useNavigation()

    const yearlyPlan = activePlan === "yearly"
    const monthlyPlan = activePlan === "monthly"

    const purchase = async () => {

    }

    const restore = async () => {

    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 35

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.roles.premium}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ImageBackground 
                source={premiumBG} 
                style={styles.container}
                imageStyle={styles.containerBG}
                blurRadius={tablet ? 2 : 7}>
                <LiquidGlassView effect="clear" style={[styles.box, fallback]}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{i18n.premium.premium.title}</Text>
                        <StarIcon width={iconSize} height={iconSize} color={colors.premiumColor} style={{marginTop: "-5"}}/>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{i18n.mobilePremium.premium.line1}</Text>
                    </View>

                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(191, 221, 255, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#2F91FF"}]}>{i18n.user.upscaledImages}</Text>
                            <UpscaledImagesIcon width={iconSize} height={iconSize} color={"#2F91FF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.upscaledImages.header}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(255, 199, 227, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#FF2792"}]}>{i18n.history.search}</Text>
                            <SearchHistoryIcon width={iconSize} height={iconSize} color={"#FF2792"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.searchHistory.header}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(247, 186, 255, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#E833FF"}]}>{i18n.help.favoriteGroups.title}</Text>
                            <FavoriteGroupsIcon width={iconSize} height={iconSize} color={"#E833FF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.favoriteGroups.header}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(208, 196, 255, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#5B2FFF"}]}>{i18n.premium.autoSearch.title}</Text>
                            <AutoSearchIcon width={40} height={40} color={"#5B2FFF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.autoSearch.header}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(202, 208, 255, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#3A51FF"}]}>{i18n.premium.bookmarkSort.title}</Text>
                            <BookmarkSortIcon width={iconSize} height={iconSize} color={"#3A51FF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.bookmarkSort.header}</Text>
                        </View>
                    </View>
                    <View style={styles.itemBox}>
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(255, 199, 227, 0.50)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#FF45F0"}]}>{i18n.user.changeUsername}</Text>
                            <ChangeUsernameIcon width={iconSize} height={iconSize} color={"#FF45F0"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.changeUsername.header}</Text>
                        </View>
                    </View>

                    <PressableHaptic style={[styles.selectionBox, yearlyPlan && {borderColor: colors.premiumColor}]}
                        onPress={() => setActivePlan("yearly")}>
                        <View style={styles.selectionBoxContainer}>
                            <Text style={styles.selectionBoxTitle}>{i18n.mobilePremium.premium.yearly}</Text>
                            <View style={styles.selectionBoxPriceLabel}>
                                <Text style={styles.selectionBoxPrice}>{i18n.mobilePremium.premium.yearlyPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.selectionBoxContainer}>
                            {yearlyPlan ? 
                            <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.premiumColor}/> :
                            <RadioButtonIcon width={iconSize} height={iconSize} color={colors.black}/>}
                        </View>
                    </PressableHaptic>
                    <PressableHaptic style={[styles.selectionBox, monthlyPlan && {borderColor: colors.premiumColor}]}
                        onPress={() => setActivePlan("monthly")}>
                        <View style={styles.selectionBoxContainer}>
                            <Text style={styles.selectionBoxTitle}>{i18n.mobilePremium.premium.monthly}</Text>
                            <View style={styles.selectionBoxPriceLabel}>
                                <Text style={styles.selectionBoxPrice}>{i18n.mobilePremium.premium.monthlyPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.selectionBoxContainer}>
                            {monthlyPlan ? 
                            <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.premiumColor}/> :
                            <RadioButtonIcon width={iconSize} height={iconSize} color={colors.black}/>}
                        </View>
                    </PressableHaptic>

                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "100%"}} 
                        style={styles.wideButton} onPress={purchase}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.white, colors.black],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.mobilePremium.premium.purchase}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View>
                    <View style={styles.centerRow}>
                        <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "100%"}} 
                        style={[styles.wideButton, {backgroundColor: colors.optionReset}]} onPress={restore}>
                        {({colorAnim}) => {
                            const color = colorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [colors.black, colors.white],
                            })
                            return (
                                <Animated.Text style={[styles.wideButtonText, {color}]}>
                                    {i18n.mobilePremium.premium.restore}
                                </Animated.Text>
                            )
                        }}
                        </ScalableHaptic>
                    </View>
                </LiquidGlassView>
            </ImageBackground>
        </ScrollView>
    )
}

export default PremiumScreen