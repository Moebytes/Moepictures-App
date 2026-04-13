/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Animated, StatusBar} from "react-native"
import Slider from "@react-native-community/slider"
import LinearGradient from "react-native-linear-gradient"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeActions, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/AppColorScreen.styles"

const AppColorScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors, appHue, appSaturation, appLightness} = useThemeSelector()
    const {setAppHue, setAppSaturation, setAppLightness} = useThemeActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const reset = () => {
        setAppHue(180)
        setAppSaturation(100)
        setAppLightness(50)
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.user.appColor}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <View style={styles.container}>
                <View style={styles.colorContainer}>
                    <Text style={styles.label}>{i18n.filters.hue}</Text>
                    <LinearGradient
                        colors={["#F00F00", "#FF4E00", "#FFC400", "#EAF900", "#8CFF00",
                                "#2FFF00", "#00FFB2", "#0BF0BF", "#0037FF", "#6A00F5",
                                "#FE00D4", "#FD007F", "#FF002B", "#FF0030"]}
                        locations={[0.00, 0.08, 0.17, 0.21, 0.25, 0.31, 0.44, 0.54,
                                    0.60, 0.70, 0.83, 0.88, 0.95, 1.0]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.gradient}>
                        <Slider
                            style={styles.slider}
                            minimumValue={60}
                            maximumValue={300}
                            step={1}
                            value={appHue}
                            onValueChange={setAppHue}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            tapToSeek={true}
                        />
                    </LinearGradient>

                    <Text style={styles.label}>{i18n.filters.saturation}</Text>
                    <LinearGradient
                        colors={["#808080", "#ff0000"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.gradient}>
                        <Slider
                            style={styles.slider}
                            minimumValue={50}
                            maximumValue={100}
                            step={1}
                            value={appSaturation}
                            onValueChange={setAppSaturation}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            tapToSeek={true}
                        />
                    </LinearGradient>

                    <Text style={styles.label}>{i18n.filters.lightness}</Text>
                    <LinearGradient
                        colors={["#000000", "#ffffff"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.gradient}>
                        <Slider
                            style={styles.slider}
                            minimumValue={45}
                            maximumValue={55}
                            step={1}
                            value={appLightness}
                            onValueChange={setAppLightness}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            tapToSeek={true}
                        />
                    </LinearGradient>

                    <ScalableHaptic scaleFactor={0.98} style={styles.wideButton} onPress={reset}>
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
                </View>
            </View>
        </View>
    )
}

export default AppColorScreen