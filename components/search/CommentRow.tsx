/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, useWindowDimensions, Pressable, Alert} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import Toast from "react-native-toast-message"
import {useNavigation} from "@react-navigation/native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useCacheSelector, useSessionSelector, useThemeSelector, useActiveActions,
useCommentDialogActions} from "../../store"
import {createStylesheet} from "./styles/CommentRow.styles"
import DateIcon from "../../assets/svg/date.svg"
import QuoteIcon from "../../assets/svg/quote.svg"
import ReportIcon from "../../assets/svg/report.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {CommentSearch} from "../../types/Types"
import FilterImage from "../image/FilterImage"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"
import permissions from "../../structures/Permissions"
import {siteURL} from "../../ui/site"

interface Props {
    comment: CommentSearch
    refetch: () => void
    onPress?: () => void
}

const CommentRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {emojis} = useCacheSelector()
    const {setQuoteText} = useActiveActions()
    const {setEditCommentID, setEditCommentText} = useCommentDialogActions()
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

    const onPress = () => {
        navigation.navigate("Post", {postID: props.comment.postID})
        props.onPress?.()
    }

    const quoteComment = async () => {
        navigation.navigate("Post", {postID: props.comment.postID})
        await functions.timeout(2000)
        const cleanComment = functions.render.parsePieces(props.comment?.comment).filter((s: string) => !s.includes(">>>")).join(" ")
        setQuoteText(functions.multiTrim(`
            >>>[${props.comment?.commentID}] ${functions.util.toProperCase(props.comment?.username)} said:
            > ${cleanComment}
        `))
    }

    const reportComment = () => {
        Alert.prompt(i18n.dialogs.reportComment.title, i18n.dialogs.reportComment.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.report, style: "destructive", onPress: async (reason = "") => {
                await functions.http.post("/api/comment/report", {commentID: props.comment.commentID, reason}, session)
                Toast.show({text1: i18n.dialogs.reportComment.submitText})
            }}
        ], "plain-text", "", "default", {cancelable: true})
    }

    const editComment = () => {
        setEditCommentText(moeText.undoLinkReplacements(props.comment.comment))
        setEditCommentID(props.comment.commentID)
    }

    const deleteComment = () => {
        Alert.alert(i18n.dialogs.deleteComment.title, i18n.dialogs.deleteComment.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.delete("/api/comment/delete", {commentID: props.comment?.commentID}, session)
                props.refetch()
            }}
        ], {cancelable: true})
    }

    if (!img) return null

    let pfpSize = 30
    let iconSize = 18
    let pfp = userPfp || `${siteURL}/favicon.png`

    const commentOptions = () => {
        if (session.username === props.comment?.username) {
            return (
                <View style={styles.optionsContainer}>
                    <ScalableHaptic style={styles.optionContainer} onPress={editComment}>
                        <EditIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                    <ScalableHaptic style={styles.optionContainer} onPress={deleteComment}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                </View>
            )
        } else {
            if (session.banned) return null
            return (
                <View style={styles.optionsContainer}>
                    <ScalableHaptic style={styles.optionContainer} onPress={quoteComment}>
                        <QuoteIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                    {permissions.isMod(session) ? <>
                    <ScalableHaptic style={styles.optionContainer} onPress={editComment}>
                        <EditIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                    <ScalableHaptic style={styles.optionContainer} onPress={deleteComment}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic> </> :
                    <ScalableHaptic style={styles.optionContainer} onPress={reportComment}>
                        <ReportIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>}
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.imageContainer} onPress={onPress}>
                <FilterImage img={img} size={size}/>
            </Pressable>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <Image style={{width: pfpSize, height: pfpSize, borderRadius: pfpSize / 2}} src={pfp} resizeMode="contain"/>
                    {functions.jsx.usernameJSX(props.comment, colors, i18n)}
                </View>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>{functions.date.timeAgo(props.comment.postDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    {moeText.renderText(props.comment.comment, emojis, colors)}
                </View>
            </View>
            {session.username ? commentOptions() : null}
        </View>
    )
}

export default CommentRow