/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {Modal, View, FlatList, ListRenderItem, GestureResponderEvent, PanResponderGestureState,
Image, Platform, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {ReactNativeZoomableView, ZoomableViewEvent} from "@openspacelabs/react-native-zoomable-view"
import {useThemeSelector, useSessionSelector, useMiscDialogSelector,
useMiscDialogActions, useCacheSelector, useLayoutActions,
useLayoutSelector, useFilterSelector} from "../store"
import {useNavigationPagination} from "../components/search/useNavigationPagination"
import {createStylesheet} from "./styles/SliderModal.styles"
import FilterImage, {loadCachedImage} from "../components/image/FilterImage"
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
    const {noteMode} = useLayoutSelector()
    const {setStatusBarVisible} = useLayoutActions()
    const {navigationPosts} = useCacheSelector()
    const filters = useFilterSelector()
    const {session, lowPerformance} = useSessionSelector()
    const {width, height} = useWindowDimensions()
    const [data, setData] = useState<ImageItem[]>([])
    const [index, setIndex] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [visible, setVisible] = useState(false)
    const styles = createStylesheet(colors, width, height)
    const navigation = useNavigation()
    const ref = useRef<FlatList<ImageItem>>(null)
    const zoomRefs = useRef(new Map<number, ReactNativeZoomableView>())
    const {loadMore} = useNavigationPagination(visible && showFullscreenImage)

    const useSkia = Platform.OS === "ios" || functions.image.filtersOn(filters)
    
    const post = data[index]?.post

    const collectImages = async () => {
        const images: ImageItem[] = []
        let initialIndex = 0

        const posts = navigationPosts.length ? navigationPosts : props.post ? [props.post] : []
        for (const post of posts) {
            for (const image of post.images) {
                if (typeof image === "string") {
                    if (image === props.image) initialIndex = images.length
                } else {
                    if (String(image.imageID) === String((props.image as VariantImage)?.imageID)) initialIndex = images.length
                }

                const img = await functions.link.resolveImage(image, session, false)
                images.push({image: img, post})
            }
        }

        setData(images)
        if (visible) return
        setIndex(initialIndex)
        setZoom(1)

        setTimeout(() => {
            if (images.length) ref.current?.scrollToIndex({index: initialIndex, animated: false})
            setVisible(true)
        }, 300)
    }

    useEffect(() => {
        if (noteMode || !showFullscreenImage || !props.image) return setVisible(false)

        collectImages()
        setStatusBarVisible(false)
    }, [noteMode, showFullscreenImage, props.image, navigationPosts])

    useEffect(() => {
        if (visible && data.length && index >= data.length - (lowPerformance ? 3 : 5)) loadMore()
    }, [index, data.length, visible])

    useEffect(() => {
        if (!visible || !showFullscreenImage) return
        let cancelled = false
        const prefetch = async () => {
            const nearby = [index + 1, index + 2, index - 1].slice(0, lowPerformance ? 1 : 3)
            for (const next of nearby) {
                if (cancelled) return
                const url = data[next]?.image
                if (!url) continue
                try {
                    if (useSkia) {
                        await loadCachedImage(url)
                    } else {
                        await Image.prefetch(url)
                    }
                } catch {}
            }
        }
        prefetch()
        return () => {
            cancelled = true
        }
    }, [index, data, visible, showFullscreenImage, lowPerformance, useSkia])

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

        if (newIndex >= data.length - (lowPerformance ? 3 : 5)) loadMore()
        if (newIndex === index) return
        setIndex(newIndex)
        setZoom(1)

        requestAnimationFrame(() => {
            zoomRefs.current.get(newIndex)?.resetPan()
        })
    }

    const onImageLoad = async () => {
        saveHistory()
    }

    const renderItem: ListRenderItem<ImageItem> = ({item, index: itemIndex}) => {
        return (
            <View style={styles.page}>
                <ReactNativeZoomableView ref={(view) => {
                    if (view) zoomRefs.current.set(itemIndex, view)
                    else zoomRefs.current.delete(itemIndex)
                }} style={styles.zoomContainer}
                    minZoom={1} maxZoom={10} visualTouchFeedbackEnabled={false}
                    panEnabled={true} lockMinZoomAxis={true} onShiftingAfter={onShiftEnd}
                    onZoomAfter={(event, gestureState, zoomObj) => {
                        if (itemIndex === index) setZoom(zoomObj.zoomLevel)
                    }}>
                    <FilterImage size={{width, height}} img={item.image} fit="contain" cache onLoad={onImageLoad}/>
                </ReactNativeZoomableView>
            </View>
        )
    }

    return (
        <Modal visible={!noteMode && showFullscreenImage} backdropColor="black" animationType="fade" 
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
                    onEndReached={loadMore}
                    onEndReachedThreshold={lowPerformance ? 2 : 4}
                    onScrollToIndexFailed={(info) => {
                        setTimeout(() => {
                            ref.current?.scrollToIndex({index: info.index, animated: false})
                        }, 100)
                    }}
                    initialNumToRender={lowPerformance ? 2 : 3}
                    maxToRenderPerBatch={lowPerformance ? 2 : 3}
                    updateCellsBatchingPeriod={16}
                    windowSize={lowPerformance ? 3 : 5}
                    removeClippedSubviews={false}
                />
            </View>
        </Modal>
    )
}

export default SliderModal