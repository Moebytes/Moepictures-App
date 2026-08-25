/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {Modal, View, FlatList, ListRenderItem, GestureResponderEvent, PanResponderGestureState,
useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {ReactNativeZoomableView, ZoomableViewEvent} from "@openspacelabs/react-native-zoomable-view"
import {useThemeSelector, useSessionSelector, useMiscDialogSelector,
useMiscDialogActions, useCacheSelector, useLayoutActions} from "../store"
import {createStylesheet} from "./styles/SliderModal.styles"
import FilterImage from "../components/image/FilterImage"
import functions from "../functions/Functions"
import {PostFull, Post, PostHistory, Image as VariantImage} from "../types/Types"

interface Props {
    post?: PostFull | PostHistory
    image?: VariantImage | string | null
}

interface ImageItem {
    image: string
    post: Post | PostHistory
}

const SliderModal: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {showFullscreenImage} = useMiscDialogSelector()
    const {setShowFullscreenImage} = useMiscDialogActions()
    const {setStatusBarVisible} = useLayoutActions()
    const {navigationPosts} = useCacheSelector()
    const {session, lowPerformance} = useSessionSelector()
    const {width, height} = useWindowDimensions()
    const [data, setData] = useState<ImageItem[]>([])
    const [index, setIndex] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [visible, setVisible] = useState(false)
    const styles = createStylesheet(colors, width, height)
    const navigation = useNavigation()
    const ref = useRef<FlatList<ImageItem>>(null)
    const zoomRef = useRef<ReactNativeZoomableView | null>(null)

    const post = data[index]?.post

    const collectImages = async () => {
        setVisible(false)
        const images: ImageItem[] = []
        let index = 0

        for (const post of navigationPosts) {
            for (const image of post.images) {
                const current = images.length

                if (typeof image === "string") {
                    if (image === props.image) index = current
                } else {
                    if (image.imageID === (props.image as VariantImage)?.imageID) index = current
                }

                const img = await functions.link.resolveImage(image, session, false)
                images.push({image: img, post})
            }
        }

        setData(images)
        setIndex(index)
        setZoom(1)

        setTimeout(() => {
            ref.current?.scrollToIndex({index, animated: false})
            setVisible(true)
        }, lowPerformance ? 300 : 10)
    }

    useEffect(() => {
        if (!showFullscreenImage) return
        if (!props.image) return

        collectImages()

        setStatusBarVisible(false)
    }, [showFullscreenImage, props.image, navigationPosts])

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

        if (Math.abs(context.offsetY) > swipeThreshold) {
            onClose()
        }

        return false
    }

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)

        if (newIndex === index) return
        setIndex(newIndex)
        setZoom(1)

        requestAnimationFrame(() => {
            zoomRef.current?.resetPan()
        })
    }

    const onImageLoad = async () => {
        saveHistory()
    }

    const renderItem: ListRenderItem<ImageItem> = ({item}) => {
        return (
            <View style={styles.page}>
                <ReactNativeZoomableView ref={zoomRef} style={styles.zoomContainer}
                    minZoom={1} maxZoom={10} visualTouchFeedbackEnabled={false}
                    panEnabled={true} lockMinZoomAxis={true} onShiftingAfter={onShiftEnd}
                    onZoomAfter={(event, gestureState, zoomObj) => setZoom(zoomObj.zoomLevel)}>
                    <FilterImage size={{width, height}} img={item.image} fit="contain" onLoad={onImageLoad}/>
                </ReactNativeZoomableView>
            </View>
        )
    }

    return (
        <Modal visible={showFullscreenImage} backdropColor="black" animationType="fade" 
        supportedOrientations={["portrait", "landscape"]} onRequestClose={onClose}>
            <View style={styles.container}>
                <FlatList
                    style={{opacity: visible ? 1 : 0}}
                    ref={ref}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    directionalLockEnabled
                    scrollEnabled={zoom <= 1.1}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                        length: width,
                        offset: width * index,
                        index
                    })}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollToIndexFailed={(info) => {
                        setTimeout(() => {
                            ref.current?.scrollToIndex({index: info.index, animated: false})
                        }, 100)
                    }}
                    initialNumToRender={lowPerformance ? 1 : 2}
                    maxToRenderPerBatch={lowPerformance ? 1 : 2}
                    windowSize={lowPerformance ? 1 : 3}
                    removeClippedSubviews={true}
                />
            </View>
        </Modal>
    )
}

export default SliderModal