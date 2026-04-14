/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, Text, Switch, Animated} from "react-native"
import {TrueSheet} from "@lodev09/react-native-true-sheet"
import {useThemeSelector, useSheetSelector, useSheetActions, useSearchSelector,
useSearchActions,
useSessionSelector} from "../store"
import ScalableHaptic from "../ui/ScalableHaptic"
import SlidingSelector from "../ui/SlidingSelector"
import AllIcon from "../assets/svg/all.svg"
import ImageIcon from "../assets/svg/image.svg"
import ComicIcon from "../assets/svg/comic.svg"
import CuteIcon from "../assets/svg/cute.svg"
import SexyIcon from "../assets/svg/sexy.svg"
import EroticIcon from "../assets/svg/erotic.svg"
import LewdIcon from "../assets/svg/lewd.svg"
import $2DIcon from "../assets/svg/2d.svg"
import $3DIcon from "../assets/svg/3d.svg"
import ChibiIcon from "../assets/svg/chibi.svg"
import PixelIcon from "../assets/svg/pixel.svg"
import DakiIcon from "../assets/svg/daki.svg"
import PromoIcon from "../assets/svg/promo.svg"
import SketchIcon from "../assets/svg/sketch.svg"
import LineartIcon from "../assets/svg/lineart.svg"
import {createStylesheet} from "./Sheet.styles"

const PostsSheet: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showPostsSheet} = useSheetSelector()
    const {setShowPostsSheet} = useSheetActions()
    const {session} = useSessionSelector()
    const {imageType, ratingType, styleType, showChildren} = useSearchSelector()
    const {setImageType, setRatingType, setStyleType, setShowChildren} = useSearchActions()
    const [localType, setLocalType] = useState(imageType)
    const [localRating, setLocalRating] = useState(ratingType)
    const [localStyle, setLocalStyle] = useState(styleType)
    const [localShowChildren, setLocalShowChildren] = useState(showChildren)
    const styles = createStylesheet(colors)
    const sheet = useRef<TrueSheet>(null)

    useEffect(() => {
        if (showPostsSheet) {
            sheet.current?.present()

            setLocalType(imageType)
            setLocalRating(ratingType)
            setLocalStyle(styleType)
            setLocalShowChildren(showChildren)
            
            setShowPostsSheet(false)
        }
    }, [showPostsSheet])

    const toggleShowChildren = () => {
        setLocalShowChildren(!localShowChildren)
    }

    const reset = () => {
        setLocalType("mobile")
        setLocalRating("all")
        setLocalStyle("all")
        setLocalShowChildren(false)
    }

    const apply = () => {
        setImageType(localType)
        setRatingType(localRating)
        setStyleType(localStyle)
        setShowChildren(localShowChildren)

        sheet.current?.dismiss()
    }

    const generateTypeButtons = () => {
        let types = [
            {name: i18n.tag.all, icon: AllIcon, value: "mobile"},
            {name: i18n.sortbar.type.image, icon: ImageIcon, value: "image"},
            {name: i18n.sortbar.type.comic, icon: ComicIcon, value: "comic"}
        ] as any

        return (
            <View style={styles.row}>
                <SlidingSelector
                    data={types}
                    value={localType}
                    onChange={setLocalType}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
        )
    }

    const generateRatingButtons = () => {
        let ratings = [
            {name: i18n.tag.all, icon: AllIcon, value: "all"},
            {name: i18n.sortbar.rating.cute, icon: CuteIcon, value: "cute"},
            {name: i18n.sortbar.rating.sexy, icon: SexyIcon, value: "sexy"},
            {name: i18n.sortbar.rating.erotic, icon: EroticIcon, value: "erotic"}
        ] as any


        let redRatings = [
            {name: i18n.sortbar.rating.allL, icon: AllIcon, value: "all+l"},
            {name: i18n.sortbar.rating.lewd, icon: LewdIcon, value: "lewd"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={ratings}
                    value={localRating}
                    onChange={setLocalRating}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            {session.showR18 ? 
            <View style={styles.row}>
                <SlidingSelector
                    data={redRatings}
                    value={localRating}
                    onChange={setLocalRating}
                    inactiveColor={colors.optionRedInactive}
                    activeColor={colors.optionRedActive}
                    iconColor={colors.redIcon}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View> : null}
            </>
        )
    }

    const generateStyleButtons = () => {
        let postStyles = [
            {name: i18n.tag.all, icon: AllIcon, value: "all"},
            {name: i18n.sortbar.style["2d"], icon: $2DIcon, value: "2d"},
            {name: i18n.sortbar.style["3d"], icon: $3DIcon, value: "3d"},
            {name: i18n.sortbar.style.chibi, icon: ChibiIcon, value: "chibi"}
        ] as any

        let postStyles2 = [
            {name: i18n.sortbar.style.pixel, icon: PixelIcon, value: "pixel"},
            {name: i18n.sortbar.style.daki, icon: DakiIcon, value: "daki"}
        ] as any

        let bluePostStyles = [
            {name: i18n.sortbar.style.allS, icon: AllIcon, value: "all+s"},
            {name: i18n.sortbar.style.promo, icon: PromoIcon, value: "promo"},
            {name: i18n.sortbar.style.sketch, icon: SketchIcon, value: "sketch"}
        ] as any

        let bluePostStyles2 = [
            {name: i18n.sortbar.style.lineart, icon: LineartIcon, value: "lineart"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={postStyles}
                    value={localStyle}
                    onChange={setLocalStyle}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={postStyles2}
                    value={localStyle}
                    onChange={setLocalStyle}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={bluePostStyles}
                    value={localStyle}
                    onChange={setLocalStyle}
                    inactiveColor={colors.optionBlueInactive}
                    activeColor={colors.optionBlueActive}
                    iconColor={colors.blueIcon}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={bluePostStyles2}
                    value={localStyle}
                    onChange={setLocalStyle}
                    inactiveColor={colors.optionBlueInactive}
                    activeColor={colors.optionBlueActive}
                    iconColor={colors.blueIcon}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            </>
        )
    }

    return (
        <TrueSheet
            ref={sheet}
            detents={[0.87]}
            cornerRadius={30}
            grabber={false}
            backgroundColor={colors.background}
            style={{borderColor: colors.optionActive, borderWidth: 1, borderRadius: 30, height: "100%"}}>
            <View style={styles.container}>
                <View style={styles.centerRow}>
                    <Text style={styles.mainTitle}>{i18n.options.searchOptions}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.sidebar.type}</Text>
                </View>
                {generateTypeButtons()}
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.sidebar.rating}</Text>
                </View>
                {generateRatingButtons()}
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.sidebar.style}</Text>
                </View>
                {generateStyleButtons()}
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.sort.child}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.buttonText}>{i18n.options.showChildPosts}</Text>
                        <Switch
                            value={localShowChildren}
                            onValueChange={toggleShowChildren}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.evenContainer}>
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton, 
                            {backgroundColor: colors.optionReset}]}
                            onPress={reset}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.black, colors.white],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.filters.reset}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                        <ScalableHaptic scaleFactor={0.97} style={styles.wideButton} onPress={apply}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.white, colors.black],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.buttons.apply}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                    </View>
                </View>
            </View>
        </TrueSheet>
    )
}

export default PostsSheet