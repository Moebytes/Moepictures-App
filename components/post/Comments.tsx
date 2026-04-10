/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useEffect} from "react"
import {View, FlatList, findNodeHandle} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useActiveActions, useActiveSelector, useFlagActions, 
useFlagSelector, useSessionSelector, useThemeSelector} from "../../store"
import {useGetCommentsQuery} from "../../api"
import {createStylesheet} from "./styles/Comments.styles"
import {PostFull} from "../../types/Types"
import TextBox, {TextBoxRef} from "../../ui/TextBox"
import Comment from "../search/Comment"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
    listRef: React.RefObject<FlatList | null>
}

const Comments: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {quoteText} = useActiveSelector()
    const {setQuoteText} = useActiveActions()
    const {commentFlag} = useFlagSelector()
    const {setCommentFlag} = useFlagActions()
    const {data: comments, refetch} = useGetCommentsQuery({postID: props.post?.postID ?? ""})
    const styles = createStylesheet(colors)
    const textBoxRef = useRef<TextBoxRef>(null)

    useEffect(() => {
        if (quoteText) {
            const text = textBoxRef.current?.getText() ?? ""
            const prevText = text.trim() ? `${text.trim()}\n` : ""
            textBoxRef.current?.updateText(`${prevText}${quoteText.trim()}`)
            textBoxRef.current?.scrollToPosition(props.listRef)
            setQuoteText("")
        }
    }, [quoteText])

    useEffect(() => {
        if (commentFlag) {
            refetch()
            setCommentFlag(false)
        }
    }, [commentFlag])

    const post = async (text: string) => {
        if (!props.post) return
        const badComment = functions.valid.validateComment(text, i18n)
        if (badComment) {
            textBoxRef.current?.showError(badComment)
            await functions.timeout(2000)
            textBoxRef.current?.clearError()
            return
        }
        textBoxRef.current?.showError(i18n.buttons.submitting)
        try {
            await functions.http.post("/api/comment/create", {postID: props.post.postID, comment: text}, session)
            textBoxRef.current?.showError(i18n.errors.comment.added)
            refetch()
            textBoxRef.current?.updateText("")
            await functions.timeout(2000)
            textBoxRef.current?.clearError()
        } catch {
            textBoxRef.current?.showError(i18n.errors.comment.bad)
            await functions.timeout(2000)
            textBoxRef.current?.clearError()
        }
    }

    const generateCommentsJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!comments) return jsx
        for (let i = 0; i < comments.length; i++) {
            jsx.push(<Comment key={comments[i].commentID} comment={comments[i]} refetch={refetch}/>)
        }
        return jsx
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.navbar.comments}</Text>
            </View>
            <View style={styles.commentsContainer}>
                {comments?.length ? generateCommentsJSX() :
                <Text style={styles.noCommentText} selectable uiTextView 
                    selectionColor={colors.borderColor}>{i18n.post.noComments}</Text>}
            </View>
            <TextBox ref={textBoxRef} onPost={post}/>
        </View>
    )
}

export default Comments