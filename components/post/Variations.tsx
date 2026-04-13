/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {View, Image, FlatList, ListRenderItem, useWindowDimensions} from "react-native"
import {useThemeSelector, useSessionSelector, useLayoutSelector} from "../../store"
import {createStylesheet} from "./styles/Variations.styles"
import {PostFull, Image as PostImage} from "../../types/Types"
import PressableHaptic from "../../ui/PressableHaptic"
import functions from "../../functions/Functions"

interface VariantProps {
    image: PostImage
    onImageChange: (img: PostImage) => void
}

const VariantImage: React.FunctionComponent<VariantProps> = (props) => {
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: width / 2, height: width / 2})
    const {colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [pressed, setPressed] = useState(false)

    useEffect(() => {
        const img = functions.link.getThumbnailLink(props.image, "medium", session)
        setImg(img)
        setLoaded(false)
    }, [props.image])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const imageSize = tablet ? 300 : 150
            let size = await functions.image.dynamicResize({uri: img}, imageSize, width)
            setSize(size)
            setLoaded(true)
        }
        updateSize()
    }, [img, tablet])

    const onPress = () => {
        props.onImageChange(props.image)
    }

    const borderWidth = pressed ? 3 : 0
    
    return (
        <PressableHaptic style={[styles.imageContainer, size, {opacity: loaded ? 1 : 0, borderWidth}]} 
            onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>

            {!loaded && <View style={{position: "absolute", width: "100%", height: "100%"}}/>}

            {img && <Image style={size} src={img} resizeMode="contain"/>}
        </PressableHaptic>
    )
}

interface Props {
    post?: PostFull
    onImageChange: (img: PostImage) => void
}

const Variations: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const renderItem: ListRenderItem<PostImage> = ({item}) => {
        return <VariantImage image={item} onImageChange={props.onImageChange}/>
    }

    if (!props.post) return null
    if (props.post.images.length <= 1) return null

    return (
        <View style={styles.container}>
            <FlatList 
                horizontal
                data={props.post.images}
                keyExtractor={(item) => item.imageID.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={styles.carousel}
            />
        </View>
    )
}

export default Variations