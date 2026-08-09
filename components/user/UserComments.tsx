/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useFlagActions, useSearchSelector} from "../../store"
import {useGetUserCommentsInfiniteQuery, useGetUserCommentsPageQuery} from "../../api"
import {createStylesheet} from "./styles/UserComments.styles"
import ScalableHaptic from "../../ui/ScalableHaptic"

interface Props {
    username: string
}

export const useUserCommentItems = (props: Props) => {
    const {scroll, pageMultiplier} = useSearchSelector()
    const [page, setPage] = useState(1)

    const pageSize = 5 * pageMultiplier

    const infiniteQuery = useGetUserCommentsInfiniteQuery(
        {username: props.username, sort: "date", limit: 5}
    )

    const pageQuery = useGetUserCommentsPageQuery(
        {username: props.username, sort: "date",
        offset: (page - 1) * pageSize, limit: pageSize}
    )

    const comments = scroll ? 
        (infiniteQuery.data?.pages.flat() ?? []) :
        (pageQuery.data ?? [])

    const loadMore = () => {
        if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage()
        }
    }

    const totalItems = Number(comments?.[0]?.commentCount ?? 0)
    const totalPages = Math.ceil(totalItems / pageSize)
    
    return {
        comments,
        loadMore,
        page,
        setPage,
        totalItems,
        totalPages,
        refetch: infiniteQuery.refetch
    }
}

interface CommentProps {
    username: string
    count: number
}

const UserComments: React.FunctionComponent<CommentProps> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {setCommentSearchFlag} = useFlagActions()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const titlePress = () => {
        navigation.navigate("Comments", undefined, {pop: true})
        setCommentSearchFlag(`comments:${props.username}`)
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <ScalableHaptic style={styles.headerContainer} scaleFactor={0.97} onPress={titlePress}>
                    <Text style={styles.headerText}>{i18n.navbar.comments}</Text>
                </ScalableHaptic>
                <Text style={styles.labelText}>{props.count}</Text>
            </View>
        </View>
    )
}

export default UserComments