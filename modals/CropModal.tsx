/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {Modal, View, Text} from "react-native"
import CrossLiquidGlassView from "../ui/CrossLiquidGlassView"
import {CropView} from "react-native-image-crop-tools"
import Toast from "react-native-toast-message"
import ScalableHaptic from "../ui/ScalableHaptic"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useMiscDialogSelector, 
useMiscDialogActions, useLayoutActions, useFlagActions} from "../store"
import {createStylesheet} from "./styles/CropModal.styles"
import functions from "../functions/Functions"
import CheckIcon from "../assets/svg/check.svg"
import XIcon from "../assets/svg/x.svg"
import {PostFull, PostHistory, Image as VariantImage} from "../types/Types"

interface Props {
    post?: PostFull | PostHistory
    image?: VariantImage | string | null
}

const CropModal: React.FunctionComponent<Props> = (props) => {
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
        const imgLink = await functions.link.resolveImage(props.image, session, session.upscaledImages)
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
        const bytes = await functions.file.readBytes(resized)
        onClose()
        await functions.http.post("/api/user/pfp", {postID: props.post.postID, bytes: Object.values(bytes)}, session)
        functions.file.deleteLocation(resized)
        setSessionFlag(true)
        Toast.show({text1: i18n.toast.changedAvatar})
    }

    let iconSize = 20

    return (
        <Modal visible={showCropImage} backdropColor="black" animationType="fade" supportedOrientations={["portrait", "landscape"]}>
            <View style={styles.container}>
                <View style={[styles.headerContainer, {top: insets.top+5}]}>
                    <ScalableHaptic scaleFactor={0.95}  onPress={onClose}>
                        <CrossLiquidGlassView interactive effect="clear" style={[styles.headerButton]}>
                            <XIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.headerText}>{i18n.buttons.cancel}</Text>
                        </CrossLiquidGlassView>
                    </ScalableHaptic>
                    
                    <ScalableHaptic scaleFactor={0.95} style={styles.headerButton} 
                        onPress={() => cropRef.current?.saveImage(true, 100)}>
                        <CrossLiquidGlassView interactive effect="clear" style={[styles.headerButton]}>
                            <CheckIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.headerText}>{i18n.buttons.done}</Text>
                        </CrossLiquidGlassView>
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

export default CropModal