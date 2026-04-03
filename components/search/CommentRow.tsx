/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions, Pressable} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {useSessionSelector, useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/CommentRow.styles"
import DateIcon from "../../assets/svg/date.svg"
import functions from "../../functions/Functions"
import {CommentSearch} from "../../types/Types"

const favicon = require("../../assets/icons/favicon.png")

interface Props {
    comment: CommentSearch
}

const CommentRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [userPfp, setUserPfp] = useState("")
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.comment) return
        const image = props.comment.post.images[0]
        const thumb = functions.link.getThumbnailLink(image, "medium", session)
        setImg(thumb)
        const pfp = functions.link.getFolderLink("pfp", props.comment.image, props.comment.imageHash)
        setUserPfp(pfp)
    }, [props.comment])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 120, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    if (!img) return null

    let pfpSize = 30
    let iconSize = 18
    let pfp = userPfp || favicon

    return (
        <View style={styles.container}>
            <Pressable style={styles.imageContainer}
            onPress={() => navigation.navigate("Post", {postID: props.comment.postID})}>
                <Image style={size} source={{uri: img}} resizeMode="contain"/>
            </Pressable>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <Image style={{width: pfpSize, height: pfpSize, borderRadius: pfpSize / 2}} source={{uri: pfp}} resizeMode="contain"/>
                    <Text style={[styles.userText, {color: functions.tag.getUserColor(props.comment, colors)}]}>{functions.util.toProperCase(props.comment.username)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>{functions.date.timeAgo(props.comment.postDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.comment.comment}</Text>
                </View>
            </View>
        </View>
    )
}

export default CommentRow