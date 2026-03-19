/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Text, Pressable, useWindowDimensions} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/CommentRow.styles"
import DateIcon from "../../assets/svg/date.svg"
import functions from "../../functions/Functions"
import {NoteSearch} from "../../types/Types"

const favicon = require("../../assets/icons/favicon.png")

interface Props {
    note: NoteSearch
}

const NoteRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [userPfp, setUserPfp] = useState("")
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.note) return
        const image = props.note.post.images[0]
        const thumb = functions.link.getThumbnailLink(image, "medium", session)
        setImg(thumb)
        const pfp = functions.link.getTagLink("pfp", props.note.image, props.note.imageHash)
        setUserPfp(pfp)
    }, [props.note])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 120, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    const parseText = () => {
        let lines = [] as string[]
        if (!props.note.notes?.length) {
            return "No data"
        }
        for (let i = 0; i < props.note.notes.length; i++) {
            const item = props.note.notes[i]
            if (item.character) {
                lines.push(`Character -> ${item.characterTag}`)
            } else {
                lines.push(`${item.transcript || "N/A"} -> ${item.translation || "N/A"}`)
            }
        }
        return lines.join("\n")
    }

    if (!img) return null

    let pfpSize = 30
    let iconSize = 18
    let pfp = userPfp || favicon

    return (
        <View style={styles.container}>
             <Pressable style={styles.imageContainer}
             onPress={() => navigation.navigate("Post", {postID: props.note.postID})}>
                <Image style={size} source={{uri: img}} resizeMode="contain"/>
             </Pressable>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <Image style={{width: pfpSize, height: pfpSize, borderRadius: pfpSize / 2}} source={{uri: pfp}} resizeMode="contain"/>
                    <Text style={styles.userText}>{props.note.updater}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>{functions.date.timeAgo(props.note.updatedDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>{parseText()}</Text>
                </View>
            </View>
        </View>
    )
}

export default NoteRow