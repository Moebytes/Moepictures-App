/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {Modal, Image, useWindowDimensions, GestureResponderEvent, PanResponderGestureState} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {ReactNativeZoomableView, ZoomableViewEvent} from "@openspacelabs/react-native-zoomable-view"
import {useThemeSelector, useSessionSelector, useMiscDialogSelector, 
useMiscDialogActions, useCacheSelector, useLayoutActions} from "../store"
import {createStylesheet} from "./styles/FullscreenModal.styles"
import FilterImage from "../components/image/FilterImage"
import functions from "../functions/Functions"
import {PostFull, Image as VariantImage} from "../types/Types"

interface Props {
    post?: PostFull
    image?: VariantImage | null
}

const FullscreenModal: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {showFullscreenImage} = useMiscDialogSelector()
    const {setShowFullscreenImage} = useMiscDialogActions()
    const {setStatusBarVisible} = useLayoutActions()
    const {navigationPosts} = useCacheSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const {width, height} = useWindowDimensions()
    const [postIndex, setPostIndex] = useState(0)
    const [imageIndex, setImageIndex] = useState(0)
    const [panEnabled, setPanEnabled] = useState(true)
    const [lock, setLock] = useState(true)
    const [zoom, setZoom] = useState(1)
    const navigation = useNavigation()
    const zoomRef = useRef<ReactNativeZoomableView>(null)
    const imageLockRef = useRef("")

    let post = navigationPosts[postIndex]
    if (!post) post = props.post!
    const prevPost = navigationPosts[postIndex - 1]
    const nextPost = navigationPosts[postIndex + 1]

    const image = post?.images[imageIndex]

    const prevImage = post?.images.length > 1 && imageIndex > 0 ?
        post?.images[imageIndex - 1] 
        : prevPost?.images[0]

    const nextImage = post?.images.length > 1 && imageIndex < post?.images.length - 1 ?
        post?.images[imageIndex + 1]
        : nextPost?.images[0]

    let img = image ? functions.link.getImageLink(image, session.upscaledImages) : ""
    const prevImg = prevImage ? functions.link.getImageLink(prevImage, session.upscaledImages) : ""
    const nextImg = nextImage ? functions.link.getImageLink(nextImage, session.upscaledImages) : ""

    if (imageLockRef.current) {
        img = imageLockRef.current
    }

    const canGoNext = zoom <= 1.1 &&
        ((post && imageIndex < post.images.length - 1) ||
        (postIndex < navigationPosts.length - 1))

    const canGoPrev = zoom <= 1.1 &&
        ((post && imageIndex > 0) ||
        (postIndex > 0))

    useEffect(() => {
        if (!showFullscreenImage) return
        if (!props.post) return

        const postIndex = navigationPosts.findIndex((post) => String(post.postID) === String(props.post!.postID))
        setPostIndex(postIndex === -1 ? 0 : postIndex)

        const imageIndex = props.post.images.findIndex((image) => String(image.imageID) === String(props.image?.imageID))
        setImageIndex(imageIndex === -1 ? 0 : imageIndex)

        setStatusBarVisible(false)
        setLock(false)
    }, [showFullscreenImage, props.post, props.image, navigationPosts])

    const onClose = () => {
        if (post && String(props.post?.postID) !== String(post.postID)) {
            functions.navigateToPost(post.postID, navigation)
        }
        setShowFullscreenImage(false)
        setStatusBarVisible(true)
    }

    const saveHistory = async () => {
        if (post && session.username) {
            await functions.http.post("/api/post/view", {postID: post.postID}, session)
        }
    }

    const onShiftEnd = (event: GestureResponderEvent | null, gestureState: PanResponderGestureState | null, 
        context: ZoomableViewEvent) => {
        if (context.zoomLevel > 1.1) return false

        const swipeThreshold = 150

        if ((context.offsetY > swipeThreshold || context.offsetY < -swipeThreshold) && !lock) {
            setLock(true)
            onClose()
        }
        
        return false
    }

    const onPageChange = (direction: "next" | "prev") => {
        // @ts-ignore
        if (zoomRef.current) zoomRef.current._ignorePagingNext = true
        setPanEnabled(false)

        if (direction === "next") {
            const lastImage = imageIndex >= (post?.images.length || 0) - 1
            imageLockRef.current = nextImg

            if (!lastImage) {
                setTimeout(() => {
                    setImageIndex((prev) => prev + 1)
                }, 300)
            } else {
                setTimeout(() => {
                    setPostIndex((prev) => prev + 1)  
                    setImageIndex(0) 
                }, 300)
            }
        } else {
            const firstImage = imageIndex <= 0
            imageLockRef.current = prevImg
            if (!firstImage) {
                setTimeout(() => {
                    setImageIndex((prev) => prev - 1)
                }, 300)
            } else {
                setTimeout(() => {
                    let prevImages = prevPost?.images || []
                    setPostIndex((prev) => prev - 1) 
                    setImageIndex((prevImages.length || 1) - 1)  
                }, 300)
            }
        }
    }

    const onImageLoad = () => {
        saveHistory()
        setTimeout(() => {
            imageLockRef.current = ""
            zoomRef.current?.resetPan()
            setPanEnabled(true)
        }, 300)
    }

    return (
        <Modal visible={showFullscreenImage} backdropColor="black" animationType="fade">
                <ReactNativeZoomableView ref={zoomRef} style={styles.container} minZoom={1} maxZoom={10} 
                    panEnabled={panEnabled} visualTouchFeedbackEnabled={false} onShiftingAfter={onShiftEnd}
                    onZoomAfter={(event, gestureState, zoomObj) => setZoom(zoomObj.zoomLevel)}
                    pagingThreshold={0.1} pagingEnabled={true} pageWidth={width} onPageChange={onPageChange} 
                    canGoNext={canGoNext} canGoPrev={canGoPrev} lockMinZoomAxis={true}>
                    <FilterImage size={{width, height}} img={prevImg}/>
                    <FilterImage size={{width, height}} img={img} onLoad={onImageLoad}/>
                    <FilterImage size={{width, height}} img={nextImg}/>
                </ReactNativeZoomableView>
        </Modal>
    )
}

export default FullscreenModal