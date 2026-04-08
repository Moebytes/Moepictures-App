/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useThemeSelector} from "../../store"
import {useGetCommentsQuery} from "../../api"
import {createStylesheet} from "./styles/Comments.styles"
import {PostFull} from "../../types/Types"
import Comment from "../search/Comment"

interface Props {
    post?: PostFull
}

const Comments: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {data: comments} = useGetCommentsQuery({postID: props.post?.postID ?? ""})
    const styles = createStylesheet(colors)

    const generateCommentsJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!comments) return jsx
        for (let i = 0; i < comments.length; i++) {
            jsx.push(<Comment key={comments[i].commentID} comment={comments[i]}/>)
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
                <Text style={styles.noCommentText}>{i18n.post.noComments}</Text>}
            </View>
        </View>
    )
}

export default Comments