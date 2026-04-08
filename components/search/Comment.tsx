/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Pressable} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useCacheSelector, useSessionSelector, useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/Comment.styles"
import DateIcon from "../../assets/svg/date.svg"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"
import {UserComment} from "../../types/Types"

const favicon = require("../../assets/icons/favicon.png")

interface Props {
    comment: UserComment
}

const Comment: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {emojis} = useCacheSelector()
    const styles = createStylesheet(colors)
    const [userPfp, setUserPfp] = useState("")

    useEffect(() => {
        if (!props.comment) return
        const pfp = functions.link.getFolderLink("pfp", props.comment.image, props.comment.imageHash)
        setUserPfp(pfp)
    }, [props.comment])

    let pfpSize = 60
    let iconSize = 18
    let pfp = userPfp || favicon

    return (
        <Pressable style={({pressed}) => [styles.container, pressed && {borderColor: colors.borderColor}]}>
             <View style={styles.userContainer}>
                <Image style={{width: pfpSize, height: pfpSize, borderRadius: 5}} source={{uri: pfp}} resizeMode="contain"/>
                <Text style={[styles.userText, {color: functions.tag.getUserColor(props.comment, colors)}]}>{functions.util.toProperCase(props.comment.username)}</Text>
             </View>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>{functions.date.timeAgo(props.comment.postDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    {moeText.renderText(props.comment.comment, emojis, colors)}
                </View>
            </View>
        </Pressable>
    )
}

export default Comment