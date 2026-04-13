/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {Modal, View, Text, Pressable} from "react-native"
import Slider from "@react-native-community/slider"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useFilterSelector, useFilterActions} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import BrightnessIcon from "../../assets/svg/brightness.svg"
import ContrastIcon from "../../assets/svg/contrast.svg"
import HueIcon from "../../assets/svg/hue.svg"
import SaturationIcon from "../../assets/svg/saturation.svg"
import LightnessIcon from "../../assets/svg/lightness.svg"
import BlurIcon from "../../assets/svg/blur.svg"
import SharpenIcon from "../../assets/svg/sharpen.svg"
import PixelateIcon from "../../assets/svg/pixelate.svg"
import Draggable from "../Draggable"

const FiltersDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showFilters, brightness, contrast, hue, 
        saturation, lightness, blur, sharpen, pixelate} = useFilterSelector()
    const {setShowFilters, setBrightness, setContrast, setHue, 
        setSaturation, setLightness, setBlur, setSharpen, setPixelate,
        resetImageFilters} = useFilterActions()
    const styles = createStylesheet(colors)

    const onClose = () => {
        setShowFilters(false)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 25

    if (showFilters) {
        return (
            <View style={styles.overlay}>
                <Draggable style={{width: "70%"}} resetKey={showFilters}>{(panHandlers) => (
                    <LiquidGlassView effect="clear" style={[styles.container, {padding: 0, gap: 0, borderWidth: 1}, fallback]}>
                        <View {...panHandlers} style={[styles.row, 
                            {width: "100%", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, overflow: "hidden"}]}>
                            <Text style={styles.title}>{i18n.filters.filters}</Text>
                        </View>
                        <View style={styles.row}>
                            <BrightnessIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={20}
                                maximumValue={180}
                                step={1}
                                value={brightness}
                                onValueChange={setBrightness}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <ContrastIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={20}
                                maximumValue={180}
                                step={1}
                                value={contrast}
                                onValueChange={setContrast}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <HueIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={130}
                                maximumValue={230}
                                step={1}
                                value={hue}
                                onValueChange={setHue}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <SaturationIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={20}
                                maximumValue={180}
                                step={1}
                                value={saturation}
                                onValueChange={setSaturation}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <LightnessIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={40}
                                maximumValue={160}
                                step={1}
                                value={lightness}
                                onValueChange={setLightness}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <BlurIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                step={0.1}
                                value={blur}
                                onValueChange={setBlur}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <SharpenIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={2}
                                step={0.1}
                                value={sharpen}
                                onValueChange={setSharpen}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.row}>
                            <PixelateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={10}
                                step={0.1}
                                value={pixelate}
                                onValueChange={setPixelate}
                                minimumTrackTintColor={colors.iconColorGlass}
                                maximumTrackTintColor="transparent"
                                tapToSeek={true}
                            />
                        </View>
                        <View style={styles.bottomRow}>
                            <PressableHaptic onPress={resetImageFilters} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.filters.reset}</Text>
                            )}
                            </PressableHaptic>

                            <PressableHaptic onPress={onClose} style={({pressed}) => [
                                styles.button, pressed && styles.buttonActive
                            ]}>{({pressed}) => (
                                <Text style={[styles.buttonText, 
                                    pressed && styles.buttonTextActive]}>{i18n.buttons.ok}</Text>
                            )}
                            </PressableHaptic>
                        </View>
                    </LiquidGlassView>
                )}</Draggable>
            </View>
        )
    }

    return null
}

export default FiltersDialog