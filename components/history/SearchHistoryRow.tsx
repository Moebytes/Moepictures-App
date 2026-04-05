/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Pressable, useWindowDimensions} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/SearchHistoryRow.styles"
import functions from "../../functions/Functions"
import {SearchHistory} from "../../types/Types"

interface Props {
    history: SearchHistory
    onPress?: () => void
}

const SearchHistoryRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.history) return
        const image = props.history.post.images[0]
        const thumb = functions.link.getThumbnailLink(image, "medium", session)
        setImg(thumb)
    }, [props.history])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 120, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    const onPress = () => {
        navigation.navigate("Post", {postID: props.history.postID})
        props.onPress?.()
    }

    if (!img) return null

    return (
        <View style={styles.container}>
             <Pressable style={styles.imageContainer} onPress={onPress}>
                <Image style={size} source={{uri: img}} resizeMode="contain"/>
             </Pressable>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.dateText}>{i18n.time.viewed} {functions.date.prettyDate(props.history.viewDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.title}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.post.title || i18n.labels.none}</Text>
                </View>
                {props.history.post.englishTitle ? <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sidebar.english}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.post.englishTitle}</Text>
                </View> : null}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sort.posted}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.post.posted ? functions.date.formatDate(new Date(props.history.post.posted)) : i18n.labels.unknown}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.source}:</Text>
                    <PressableHaptic onPress={() => functions.link.openSourceLink(props.history.post.source)}>
                        <Text style={styles.text} selectable uiTextView
                        selectionColor={colors.borderColor}>{functions.util.getSiteName(props.history.post.source, i18n)}</Text>
                    </PressableHaptic>
                </View>
                {props.history.post.mirrors?.twitter ? <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.mirrors}:</Text>
                    <PressableHaptic onPress={() => functions.link.openSourceLink(props.history.post.mirrors?.twitter)}>
                        <Text style={styles.text} selectable uiTextView
                        selectionColor={colors.borderColor}>{functions.util.getSiteName(props.history.post.mirrors.twitter, i18n)}</Text>
                    </PressableHaptic>
                </View> : null}
            </View>
        </View>
    )
}

export default SearchHistoryRow