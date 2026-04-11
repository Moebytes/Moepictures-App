/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect, useRef} from "react"
import {View, ScrollView} from "react-native"
import Clipboard from "@react-native-clipboard/clipboard"
import {UITextView as Text} from "react-native-uitextview"
import Toast from "react-native-toast-message"
import {useRoute, useNavigation} from "@react-navigation/native"
import {LiquidGlassContainerView, LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useThemeSelector, useSessionSelector} from "../../store"
import {useGetUserQuery} from "../../api"
import {createStylesheet} from "./styles/PostDrawer.styles"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import EditIcon from "../../assets/svg/edit.svg"
import CopyIDIcon from "../../assets/svg/copy-id.svg"
import {PostFull, TagCount, TagGroupCategory} from "../../types/Types"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
    artists?: TagCount[] 
    characters?: TagCount[]  
    series?: TagCount[]
    meta?: TagCount[]
    tags?: TagCount[]
}

const PostDrawer: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)
    const insets = useSafeAreaInsets()
    const [dimensions, setDimensions] = useState({width: 0, height: 0, size: 0})
    const [copied, setCopied] = useState(false)
    const [tagGroupCategories, setTagGroupCategories] = useState([] as TagGroupCategory[])
    const {data: uploader} = useGetUserQuery({username: props.post?.uploader ?? ""})
    const ref = useRef<ScrollView>(null)
    const route = useRoute()
    const navigation = useNavigation()

    useEffect(() => {
      ref.current?.scrollTo({y: 0, animated: false})
    }, [route.params])

    const updateGroupCategories = async () => {
        if (!props.post) return
        const groupCategories = await functions.tag.tagGroupCategories(props.post, session)
        setTagGroupCategories(groupCategories)
    }

    useEffect(() => {
        const updateDimensions = async () => {
            if (!props.post) return
            const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
            const dimensions = await functions.image.imageDimensions(img)
            setDimensions(dimensions)
        }
        updateDimensions()
        updateGroupCategories()
    }, [props.post])

    const generateTagJSX = (tags?: TagCount[]) => {
        let jsx = [] as React.ReactElement[]
        if (!tags) return jsx

        for (const item of tags) {
            jsx.push(
                <PressableHaptic key={item.tag} onPress={() => navigation.navigate("Tag", {name: item.tag})}>
                    <LiquidGlassView interactive effect="clear" 
                        style={[styles.tag, {backgroundColor: functions.tag.getGlassColor(item, colors)}]}>
                            <Text style={styles.tagText}>{item.tag.replace(/-/g, " ")}</Text>
                    </LiquidGlassView>
                </PressableHaptic>
            )
        }
        return jsx
    }

    const organizeTags = (tags?: TagCount[]) => {
        if (!tags?.length) return [] as TagCount[]
        const meta = tags.filter((t) => t.type === "meta")
        const appearance = tags.filter((t) => t.type === "appearance")
        const outfit = tags.filter((t) => t.type === "outfit")
        const accessory = tags.filter((t) => t.type === "accessory")
        const action = tags.filter((t) => t.type === "action")
        const scenery = tags.filter((t) => t.type === "scenery")
        const other = tags.filter((t) => t.type === "tag")
        return [...meta, ...appearance, ...outfit, ...accessory, ...action, ...scenery, ...other.reverse()]
    }

    const generateTagGroupJSX = () => {
        let jsx = [] as React.ReactElement[]
        let tagGroups = functions.tag.appendOrphanTags(tagGroupCategories, props.tags)
        tagGroups = [...tagGroups].sort((a, b) => {
            return a.name.toLowerCase() === "tags" ? 1 :
                b.name.toLowerCase() === "tags" ? -1 : 0
        })
        for (const tagGroup of tagGroups) {
            let currentTags = organizeTags(tagGroup.tags)
            if (!currentTags.length) continue
            jsx.push(
                <>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{tagGroup.name}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(currentTags)}
                </View>
                </>
            )
        }
        if (props.meta?.length) {
            jsx.push(
                <>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.tag.meta}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(organizeTags(props.meta))}
                </View>
                </>
            )
        }
        return jsx
    }

    const editPost = () => {
        if (!props.post) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        navigation.navigate("EditPost", {postID: props.post.postID}, {pop: true})
    }

    const copyPostID = () => {
        if (!props.post || copied) return
        Clipboard.setString(props.post.postID)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (!props.post) return null

    return (
        <LiquidGlassContainerView style={{flex: 1}}>
        <LiquidGlassView effect="clear" style={[{flex: 1}, fallback, {paddingTop: insets.top + 10}]}>
            <ScrollView ref={ref} style={{flex: 1}} showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.container, {paddingBottom: insets.bottom + 40}]}>
                <View style={styles.rowItem}>
                    <Text style={styles.title}>{i18n.dialogs.postInfo.title}</Text>
                    {session.username ? 
                    <ScalableHaptic onPress={editPost}>
                        <EditIcon width={30} height={30} color={colors.drawerTitle}/>
                    </ScalableHaptic> : null}
                </View>
                <View style={styles.rowItem}>
                    <PressableHaptic onPress={copyPostID}>
                        <LiquidGlassView interactive effect="clear" 
                            style={[styles.tag, styles.button]}>
                            <Text style={styles.tagText2}>{copied ? i18n.banner.copied : i18n.labels.copyID}</Text>
                            <CopyIDIcon width={25} height={25} color={colors.white}/>
                        </LiquidGlassView>
                    </PressableHaptic>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.labels.title}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.title}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.english}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.englishTitle}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.tag.artist}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.artist}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sort.posted}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {functions.date.formatDate(new Date(props.post.posted))}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sort.bookmarks}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.bookmarks}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.tag.artist}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.artists)}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.tag.character}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.characters)}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.tag.series}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.series)}
                </View>
                {tagGroupCategories.length ? generateTagGroupJSX() : <>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.navbar.tags}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(organizeTags(props.tags))}
                </View></>}
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.uploader}:</Text>
                    {uploader && functions.jsx.usernameJSX(uploader, colors, i18n, {fontSize: 18}, 22)}
                    {/*<Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {functions.util.toProperCase(props.post.uploader)}</Text>*/}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.uploaded}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {functions.date.formatDate(new Date(props.post.uploadDate))}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.type}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {/* @ts-ignore */}
                        {i18n.sortbar.type[props.post.type]}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.rating}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {/* @ts-ignore */}
                        {i18n.sortbar.rating[props.post.rating]}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sidebar.style}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {/* @ts-ignore */}
                        {i18n.sortbar.style[props.post.style]}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sort.favorites}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.favoriteCount}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.sort.cuteness}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {props.post.cuteness}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.labels.resolution}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {dimensions.width}x{dimensions.height}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>{i18n.labels.size}:</Text>
                    <Text style={styles.text} selectable uiTextView selectionColor={colors.borderColor}>
                        {functions.util.readableFileSize(dimensions.size)}</Text>
                </View>
            </ScrollView>
        </LiquidGlassView>
        </LiquidGlassContainerView>
    )
}

export default PostDrawer