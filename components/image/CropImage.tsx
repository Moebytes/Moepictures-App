/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {Modal, View, Text} from "react-native"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {CropView} from "react-native-image-crop-tools"
import Toast from "react-native-toast-message"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useMiscDialogSelector, 
useMiscDialogActions, useLayoutActions, useFlagActions} from "../../store"
import {createStylesheet} from "./styles/CropImage.styles"
import functions from "../../functions/Functions"
import CheckIcon from "../../assets/svg/check.svg"
import XIcon from "../../assets/svg/x.svg"
import {PostFull, Image as VariantImage} from "../../types/Types"

interface Props {
    post?: PostFull
    image?: VariantImage | null
}

const CropImage: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {showCropImage} = useMiscDialogSelector()
    const {setShowCropImage} = useMiscDialogActions()
    const {setStatusBarVisible} = useLayoutActions()
    const {setSessionFlag} = useFlagActions()
    const {session} = useSessionSelector()
    const [img, setImg] = useState("")
    const styles = createStylesheet(colors)
    const cropRef = useRef<CropView>(null)
    const insets = useSafeAreaInsets()

    const downloadImage = async () => {
        if (!props.image) return
        const imgLink = functions.link.getImageLink(props.image, session.upscaledImages)
        const uri = await functions.file.saveRemoteImage(imgLink)
        setImg(uri)
    }

    useEffect(() => {
        if (!showCropImage) return
        downloadImage()
        setStatusBarVisible(false)
    }, [showCropImage, props.image, session])

    const onClose = () => {
        setShowCropImage(false)
        setStatusBarVisible(true)
        functions.file.deleteLocation(img)
        setImg("")
    }

    const onCrop = async (data: {uri: string, width: number, height: number}) => {
        if (!props.post) return
        const resized = await functions.file.resizeLocalImage(data.uri, 300, 300)
        const buffer = await fetch(resized).then((r) => r.arrayBuffer())
        const bytes = new Uint8Array(buffer)
        onClose()
        await functions.http.post("/api/user/pfp", {postID: props.post.postID, bytes: Object.values(bytes)}, session)
        functions.file.deleteLocation(resized)
        setSessionFlag(true)
        Toast.show({text1: i18n.toast.changedAvatar})
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    let iconSize = 20

    return (
        <Modal visible={showCropImage} backdropColor="black" animationType="fade">
            <View style={styles.container}>
                <View style={[styles.headerContainer, {top: insets.top+5}]}>
                    <ScalableHaptic scaleFactor={0.95}  onPress={onClose}>
                        <LiquidGlassView interactive effect="clear" style={styles.headerButton}>
                            <XIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.headerText}>{i18n.buttons.cancel}</Text>
                        </LiquidGlassView>
                    </ScalableHaptic>
                    
                    <ScalableHaptic scaleFactor={0.95} style={styles.headerButton} 
                        onPress={() => cropRef.current?.saveImage(true, 100)}>
                        <LiquidGlassView interactive effect="clear" style={styles.headerButton}>
                            <CheckIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.headerText}>{i18n.buttons.done}</Text>
                        </LiquidGlassView>
                    </ScalableHaptic>
                </View>
                {img && <CropView
                    sourceUrl={img}
                    style={styles.image}
                    ref={cropRef}
                    onImageCrop={onCrop}
                    keepAspectRatio={true}
                    aspectRatio={{width: 1, height: 1}}
                />}
            </View>
        </Modal>
    )
}

export default CropImage