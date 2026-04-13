/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Pressable, Alert} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useActiveActions, useCacheSelector, useSessionSelector, useThemeSelector,
useCommentDialogActions, useCacheActions} from "../../store"
import {createStylesheet} from "./styles/Comment.styles"
import DateIcon from "../../assets/svg/date.svg"
import QuoteIcon from "../../assets/svg/quote.svg"
import ReportIcon from "../../assets/svg/report.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {UserComment} from "../../types/Types"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"
import permissions from "../../structures/Permissions"

const favicon = require("../../assets/icons/favicon.png")

interface Props {
    comment: UserComment
    refetch: () => void
}

const Comment: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setQuoteText} = useActiveActions()
    const {setEditCommentID, setEditCommentText} = useCommentDialogActions()
    const {emojis} = useCacheSelector()
    const {setNavigationPosts} = useCacheActions()
    const styles = createStylesheet(colors)
    const [userPfp, setUserPfp] = useState("")
    const navigation = useNavigation()

    useEffect(() => {
        if (!props.comment) return
        const pfp = functions.link.getFolderLink("pfp", props.comment.image, props.comment.imageHash)
        setUserPfp(pfp)
    }, [props.comment])

    let pfpSize = 60
    let iconSize = 18
    let pfp = userPfp || favicon

    const pfpPress = () => {
        if (props.comment.imagePost) {
            functions.navigateToPost(props.comment.imagePost, navigation)
            setNavigationPosts([])
        }
    }

    const quoteComment = () => {
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
        <Pressable style={({pressed}) => [styles.container, pressed && {borderColor: colors.borderColor}]}>
             <Pressable style={styles.userContainer} onPress={pfpPress}>
                <Image style={{width: pfpSize, height: pfpSize, borderRadius: 5}} src={pfp} resizeMode="contain"/>
                {functions.jsx.usernameJSX(props.comment, colors, i18n, {fontSize: 18}, 20)}
             </Pressable>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>{functions.date.timeAgo(props.comment.postDate, i18n)}</Text>
                </View>
                <View style={styles.rowContainer}>
                    {moeText.renderText(props.comment.comment, emojis, colors)}
                </View>
            </View>
            {session.username ? commentOptions() : null}
        </Pressable>
    )
}

export default Comment