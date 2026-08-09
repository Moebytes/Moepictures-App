/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, ScrollView, ImageBackground, Animated, StatusBar, Platform} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useIAP, getAvailablePurchases, finishTransaction, ErrorCode, ProductSubscription, SubscriptionOffer, Purchase} from "react-native-iap"
import Toast from "react-native-toast-message"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useFlagActions, useLayoutSelector, useSessionSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import StarIcon from "../../assets/svg/premium-star.svg"
import UpscaledImagesIcon from "../../assets/svg/waifu2x.svg"
import ImageFiltersIcon from "../../assets/svg/filters.svg"
import SearchHistoryIcon from "../../assets/svg/searchhistory.svg"
import FavoriteGroupsIcon from "../../assets/svg/stargroup.svg"
import SavedSearchesIcon from "../../assets/svg/savedsearch.svg"
import AutoSearchIcon from "../../assets/svg/autosearch2.svg"
import AutoScrollIcon from "../../assets/svg/autoscroll2.svg"
import BookmarkSortIcon from "../../assets/svg/bookmarksort.svg"
import ChangeUsernameIcon from "../../assets/svg/changeusername.svg"
import RadioButtonIcon from "../../assets/svg/radiobutton.svg"
import RadioButtonCheckedIcon from "../../assets/svg/radiobutton-checked.svg"
import {createStylesheet} from "./styles/PremiumScreen.styles"
import functions from "../../functions/Functions"

const premiumBG = require("../../assets/images/premiumBG.jpg")

const PremiumScreen: React.FunctionComponent = () => {
    const {tablet} = useLayoutSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const styles = createStylesheet(colors, tablet)
    const [yearlySubscription, setYearlySubscription] = useState<ProductSubscription | SubscriptionOffer | null>(null)
    const [monthlySubscription, setMonthlySubscription] = useState<ProductSubscription | SubscriptionOffer | null>(null)
    const [activePlan, setActivePlan] = useState("yearly")
    const navigation = useNavigation()
    const purchaseRef = useRef(false)

    const validatePurchase = async (purchase: Purchase) => {
        const validPurchase = await functions.http.post("/api/premium/verify-purchase", {
            platform: Platform.OS,
            purchaseToken: purchase.purchaseToken!
        }, session)

        if (validPurchase) {
            await finishTransaction({purchase, isConsumable: false})
            if (purchaseRef.current) Toast.show({text1: i18n.toast.premiumUpgrade})
            setSessionFlag(true)
        } else {
            Toast.show({text1: i18n.toast.paymentError})
        }
        return validPurchase
    }

    const {connected, subscriptions, fetchProducts, requestPurchase, restorePurchases} = useIAP({
        onPurchaseSuccess: async (purchase) => {
            try {
                await validatePurchase(purchase)
            } finally {
                purchaseRef.current = false
            }
        },
        onPurchaseError: (error) => {
            if (error.code === ErrorCode.UserCancelled) return
            Toast.show({text1: i18n.toast.paymentError})
        }
    })

    useEffect(() => {
        if (!connected) return
        fetchProducts({skus: Platform.OS === "ios" ? [
            "com.moebytes.moepictures.premium.yearly",
            "com.moebytes.moepictures.premium.monthly"
        ] : [
            "com.moebytes.moepictures.premium"
        ], type: "subs"})
    }, [connected])

    useEffect(() => {
        for (const subscription of subscriptions) {
            if (Platform.OS === "ios") {
                if (subscription.id === "com.moebytes.moepictures.premium.yearly") {
                    setYearlySubscription(subscription)
                } else if (subscription.id === "com.moebytes.moepictures.premium.monthly") {
                    setMonthlySubscription(subscription)
                }
            } else {
                if (subscription.id === "com.moebytes.moepictures.premium") {
                    const yearlyOffer = subscription.subscriptionOffers?.find((s) => s.id === "premium-yearly")
                    const monthlyOffer = subscription.subscriptionOffers?.find((s) => s.id === "premium-monthly")
                    if (yearlyOffer) setYearlySubscription(yearlyOffer)
                    if (monthlyOffer) setMonthlySubscription(monthlyOffer)
                }
            }
        }
    }, [subscriptions])

    const purchase = async () => {
        purchaseRef.current = true

        try {
            if (activePlan === "yearly") {
                await requestPurchase({request: {
                    apple: {sku: "com.moebytes.moepictures.premium.yearly", appAccountToken: session.accountToken},
                    google: {skus: ["com.moebytes.moepictures.premium"], subscriptionOffers: [{
                            sku: "com.moebytes.moepictures.premium", 
                            offerToken: (yearlySubscription as SubscriptionOffer).offerTokenAndroid!
                        }], obfuscatedAccountId: session.accountToken}
                }, type: "subs"})

            } else if (activePlan === "monthly") {
                await requestPurchase({request: {
                    apple: {sku: "com.moebytes.moepictures.premium.monthly", appAccountToken: session.accountToken},
                    google: {skus: ["com.moebytes.moepictures.premium"], subscriptionOffers: [{
                            sku: "com.moebytes.moepictures.premium", 
                            offerToken: (monthlySubscription as SubscriptionOffer).offerTokenAndroid!
                        }], obfuscatedAccountId: session.accountToken}
                }, type: "subs"})
            }
        } catch {
            purchaseRef.current = false
        }
    }

    const restore = async () => {
        await restorePurchases()
        const purchases = await getAvailablePurchases()
        let restored = false
        for (const purchase of purchases) {
            let success = await validatePurchase(purchase)
            if (success) restored = true
        }
        if (restored) Toast.show({text1: i18n.toast.premiumRestored})
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 35


    let offset = Platform.OS === "android" ? 40 : 0

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: colors.mainColor}}
            contentContainerStyle={{paddingBottom: offset}}>
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
                        <Text style={styles.text}>{session.premium ? i18n.mobilePremium.premium.alreadyPremium : 
                            i18n.mobilePremium.premium.line1}</Text>
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
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(230, 186, 255, 0.5)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#8352FF"}]}>{i18n.options.savedSearches}</Text>
                            <SavedSearchesIcon width={iconSize} height={iconSize} color={"#8352FF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.savedSearches.header}</Text>
                        </View>
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
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(191, 207, 255, 0.5)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#304FFF"}]}>{i18n.mobilePremium.imageFilters.title}</Text>
                            <ImageFiltersIcon width={iconSize} height={iconSize} color={"#304FFF"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.imageFilters.header}</Text>
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
                        <View style={[styles.itemBoxRow, {backgroundColor: "rgba(255, 186, 235, 0.5)"}]}>
                            <Text style={[styles.itemBoxTitle, {color: "#FF38B3"}]}>{i18n.mobilePremium.autoScroll.title}</Text>
                            <AutoScrollIcon width={iconSize} height={iconSize} color={"#FF38B3"}/>
                        </View>
                        <View style={styles.itemBoxRow}>
                            <Text style={styles.text}>{i18n.mobilePremium.autoScroll.header}</Text>
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

                    <PressableHaptic style={[styles.selectionBox, activePlan === "yearly" && {borderColor: colors.premiumColor}]}
                        onPress={() => setActivePlan("yearly")}>
                        <View style={styles.selectionBoxContainer}>
                            <Text style={styles.selectionBoxTitle}>{i18n.mobilePremium.premium.yearly}</Text>
                            <View style={styles.selectionBoxPriceLabel}>
                                <Text style={styles.selectionBoxPrice}>{yearlySubscription?.displayPrice ?? "$29.99"} {i18n.mobilePremium.premium.yearlyPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.selectionBoxContainer}>
                            {activePlan === "yearly" ? 
                            <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.premiumColor}/> :
                            <RadioButtonIcon width={iconSize} height={iconSize} color={colors.black}/>}
                        </View>
                    </PressableHaptic>
                    <PressableHaptic style={[styles.selectionBox, activePlan === "monthly" && {borderColor: colors.premiumColor}]}
                        onPress={() => setActivePlan("monthly")}>
                        <View style={styles.selectionBoxContainer}>
                            <Text style={styles.selectionBoxTitle}>{i18n.mobilePremium.premium.monthly}</Text>
                            <View style={styles.selectionBoxPriceLabel}>
                                <Text style={styles.selectionBoxPrice}>{monthlySubscription?.displayPrice ?? "$2.99"} {i18n.mobilePremium.premium.monthlyPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.selectionBoxContainer}>
                            {activePlan === "monthly" ? 
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
                                    {session.premium ? i18n.mobilePremium.premium.manage : 
                                        i18n.mobilePremium.premium.purchase}
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

                    <View style={styles.row}>
                        <View style={[styles.itemBoxRow, {borderRadius: 13, backgroundColor: "rgba(255, 199, 227, 0.30)"}]}>
                        <Text style={styles.text}>
                            {i18n.mobilePremium.premium.renewal}
                        </Text>
                        </View>
                    </View>
                </LiquidGlassView>
            </ImageBackground>
        </ScrollView>
    )
}

export default PremiumScreen