/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, useWindowDimensions, Alert} from "react-native"
import {UITextView as Text} from "@bsky.app/react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {useInvalidateGroup} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/HistoryRow.styles"
import RevertIcon from "../../assets/svg/revert.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import FilterImage from "../image/FilterImage"
import {GroupHistory} from "../../types/Types"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

interface Props {
    history: GroupHistory
    currentHistory: GroupHistory
    index: number
    refetch: () => void
}

const GroupHistoryRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const navigation = useNavigation()
    let hasChanges = functions.compare.hasHistoryChanges(props.history)
    const invalidateGroup = useInvalidateGroup()

    useEffect(() => {
        if (!props.history) return
        const updateImage = async () => {
            const targetID = props.history.posts[0].postID ?? ""
            if (!targetID) return
            const post = await functions.http.get("/api/post", {postID: targetID}, session)
            if (!post) return
            const thumb = await functions.link.getPostThumbnail(post, 0, "medium", session)
            setImg(thumb)
        }
        updateImage()
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
        let historyID = props.history.historyID === props.currentHistory.historyID ? "" : props.history.historyID
        navigation.navigate("Group", {slug: props.currentHistory.slug, historyID}, {pop: true})
    }

    const openPost = (postID: string | null) => {
        if (!postID) return
        navigation.navigate("Post", {postID}, {pop: true})
    }

    const revertHistory = () => {
        Alert.alert(i18n.dialogs.revertGroupHistory.title, i18n.dialogs.revertGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.revert, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                await functions.http.put("/api/group/reorder", {slug: props.currentHistory.slug, posts: props.history.posts}, session)
                await functions.http.put("/api/group/edit", {slug: props.currentHistory.slug, name: props.history.name, description: props.history.description}, session)
                
                navigation.navigate("GroupHistory", {slug: functions.post.generateSlug(props.history.name)}, {pop: true})
                invalidateGroup(props.currentHistory.slug)
                props.refetch()
            }}
        ], {cancelable: true})
    }

    const deleteHistory = () => {
        Alert.alert(i18n.dialogs.deleteGroupHistory.title, i18n.dialogs.deleteGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                await functions.http.delete("/api/group/history/delete", {slug: props.currentHistory.slug, historyID: props.history.historyID}, session)
                props.refetch()
            }}
        ], {cancelable: true})
    }

    let iconSize = 18

    const historyOptions = () => {
        if (session.banned) return null
        if (permissions.isMod(session)) {
            return (
                <View style={styles.optionsContainerRelative}>
                    <ScalableHaptic style={styles.optionContainer} onPress={revertHistory}>
                        <RevertIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                    <ScalableHaptic style={styles.optionContainer} onPress={deleteHistory}>
                        <DeleteIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                </View>
            )
        } else if (permissions.isContributor(session)) {
            return (
                <View style={styles.optionsContainerRelative}>
                    <ScalableHaptic style={styles.optionContainer} onPress={revertHistory}>
                        <RevertIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    </ScalableHaptic>
                </View>
            )
        }
    }

    const dateTextJSX = () => {
        let firstHistory = props.index === Number(props.history.historyCount) - 1
        let targetDate = props.history.date
        const editText = firstHistory ? i18n.time.created : i18n.time.edited

        return functions.jsx.usernameJSX(props.history.user, 
            colors, i18n, navigation, styles.dateText, undefined, styles.dateContainer, editText, targetDate)
    }

    const postDiff = () => {
        const addedPostsJSX = props.history.addedPosts.map((postID: string) => (
            <PressableHaptic onPress={() => openPost(postID)}>
                <Text style={styles.tagAdd}>+{postID}</Text>
            </PressableHaptic>
        ))
        const removedPostsJSX = props.history.removedPosts.map((postID: string) => (
            <PressableHaptic onPress={() => openPost(postID)}>
                <Text style={styles.tagRemove}>-{postID}</Text>
            </PressableHaptic>
        ))
        if (![...addedPostsJSX, ...removedPostsJSX].length) return null
        return [...addedPostsJSX, ...removedPostsJSX]
    }

    const diffJSX = () => {
        let jsx = [] as React.ReactElement[]
        let changes = props.history.changes || {}
        let postChanges = props.history.addedPosts?.length || props.history.removedPosts?.length

        if (!hasChanges || changes.name) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.name}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.name}</Text>
                </View>)
        }
        if (!hasChanges || changes.description) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.description}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.description || i18n.labels.none}</Text>
                </View>)
        }
        if (postChanges) {
            if (postDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.sort.posts}:</Text>
                        <Text style={styles.text}>{postDiff()}</Text>
                    </View>)
            }
        }
        if (!jsx.length && !props.history.orderChanged) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{i18n.labels.noData}</Text>
                </View>)
        }
        return jsx
    }

    if (!img) return null

    return (
        <View style={styles.container}>
            <Pressable style={styles.imageContainer} onPress={onPress}>
                <FilterImage img={img} size={size}/>
                <Text style={styles.title}>{props.history.name}</Text>
            </Pressable>
            <View style={styles.textContainer}>
                {historyOptions()}
                {dateTextJSX()}
                {props.history.orderChanged ? 
                <View style={styles.rowContainer}>
                    <Text style={styles.changeText} selectable uiTextView
                    selectionColor={colors.borderColor}>[{i18n.labels.orderUpdated}]</Text>
                </View> : null}
                {diffJSX()}
                {props.history.reason ? 
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.reason}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.reason}</Text>
                </View>
                : null}
            </View>
        </View>
    )
}

export default GroupHistoryRow