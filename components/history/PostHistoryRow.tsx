/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, useWindowDimensions, Alert} from "react-native"
import {UITextView as Text} from "@bsky.app/react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {useInvalidatePost} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/HistoryRow.styles"
import RevertIcon from "../../assets/svg/revert.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import FilterImage from "../image/FilterImage"
import {PostHistory, TagCategories, SourceData} from "../../types/Types"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

interface Props {
    history: PostHistory
    currentHistory: PostHistory
    index: number
    refetch: () => void
}

const PostHistoryRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const [tagCategories, setTagCategories] = useState({} as TagCategories)
    const navigation = useNavigation()
    let hasChanges = functions.compare.hasHistoryChanges(props.history)
    const invalidatePost = useInvalidatePost()

    const updateTagCategories = async () => {
        if (!props.history.addedTags || !props.history.removedTags) return
        let tagMap = [...props.history.addedTags, ...props.history.removedTags]
        const tagCategories = await functions.tag.tagCategories(tagMap, session)
        setTagCategories(tagCategories)
    }

    useEffect(() => {
        updateTagCategories()
    }, [props.history, session])

    useEffect(() => {
        if (!props.history) return
        const updateImage = async () => {
            const thumb = await functions.link.getPostThumbnail(props.history, 0, "medium", session)
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
        navigation.navigate("Post", {postID: props.history.postID, historyID}, {pop: true})
    }

    const openPost = (postID: string | null) => {
        if (!postID) return
        navigation.navigate("Post", {postID}, {pop: true})
    }

    const openSource = (source: string | null) => {
        if (source) functions.link.openSourceLink(source)
    }

    const openUserProfile = (social: string | null) => {
        if (social) functions.link.openSocialLink(social)
    }

    const revertHistory = () => {
        Alert.alert(i18n.dialogs.revertPostHistory.title, i18n.dialogs.revertGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.revert, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                const imgChanged = await functions.compare.imagesChanged(props.history, props.currentHistory, session)
                const tagsChanged = functions.compare.tagsChanged(props.history, props.currentHistory)
                const srcChanged = functions.compare.sourceChanged(props.history, props.currentHistory)
                let imageSources = functions.post.imageSourceMap(props.history)
                let imageLinks = functions.post.imageLinkMap(props.history)
                let source = null as SourceData | null
                if (imgChanged || srcChanged) {
                    source = {
                        title: props.history.title,
                        englishTitle: props.history.englishTitle,
                        artist: props.history.artist,
                        posted: props.history.posted ? functions.date.formatDate(new Date(props.history.posted), true) : "",
                        source: props.history.source,
                        commentary: props.history.commentary,
                        englishCommentary: props.history.englishCommentary,
                        bookmarks: props.history.bookmarks,
                        buyLink: props.history.buyLink,
                        pixivTags: props.history.pixivTags,
                        userProfile: props.history.userProfile,
                        drawingTools: props.history.drawingTools,
                        sourceImageCount: props.history.sourceImageCount,
                        mirrors: props.history.mirrors ? Object.values(props.history.mirrors).join("\n") : ""
                    }
                }
                if (imgChanged || (srcChanged && tagsChanged)) {
                    if (imgChanged && !permissions.isMod(session)) return Promise.reject("img")
                    const {images, upscaledImages} = await functions.post.parseImages(props.history, session)
                    const newTags = await functions.post.parseNewTags(props.history, session)

                    let {imageChunks, upscaledChunks} = functions.byte.chunkImages(images, upscaledImages)
                    await functions.byte.uploadChunks(imageChunks, upscaledChunks, session)

                    await functions.http.put("/api/post/edit", {postID: props.history.postID, imageChunks, upscaledChunks, 
                    type: props.history.type, rating: props.history.rating, source: source!, style: props.history.style, 
                    artists: functions.tag.tagObject(props.history.artists), characters: functions.tag.tagObject(props.history.characters), 
                    preserveChildren: Boolean(props.history.parentID), series: functions.tag.tagObject(props.history.series), 
                    parentID: props.history.parentID, noImageUpdate: true, tags: props.history.tags, tagGroups: props.history.tagGroups, 
                    imageSources, imageLinks, newTags, reason: props.history.reason}, session)
                } else {
                    await functions.http.put("/api/post/quickedit", {postID: props.history.postID, type: props.history.type, 
                    rating: props.history.rating, source: source!, style: props.history.style, artists: props.history.artists, 
                    characters: props.history.characters, series: props.history.series, tags: props.history.tags, imageSources,
                    imageLinks, tagGroups: props.history.tagGroups, parentID: props.history.parentID, reason: props.history.reason}, 
                    session)
                }
                
                invalidatePost(props.history.postID)
                props.refetch()
            }}
        ], {cancelable: true})
    }

    const deleteHistory = () => {
        Alert.alert(i18n.dialogs.deletePostHistory.title, i18n.dialogs.deleteGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                await functions.http.delete("/api/post/history/delete", {postID: props.history.postID, 
                    historyID: props.history.historyID}, session)
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

    const calculateDiff = (addedTags: string[], removedTags: string[]) => {
        const addedTagsJSX = addedTags.map((tag: string) => <Text style={styles.tagAdd}>+{tag}</Text>)
        const removedTagsJSX = removedTags.map((tag: string) => <Text style={styles.tagRemove}>-{tag}</Text>)
        if (![...addedTags, ...removedTags].length) return null
        return [...addedTagsJSX, ...removedTagsJSX]
    }

    const artistsDiff = () => {
        if (!hasChanges) return <Text style={styles.text} selectable uiTextView
            selectionColor={colors.borderColor}>{props.history.artists.join(" ")}</Text>
        if (!tagCategories.artists) return null
        const tagCategory = tagCategories.artists.map((t) => t.tag)
        const addedTags = props.history.addedTags.filter((tag: string) =>  tagCategory.includes(tag))
        const removedTags = props.history.removedTags.filter((tag: string) => tagCategory.includes(tag))
        return calculateDiff(addedTags, removedTags)
    }

    const charactersDiff = () => {
        if (!hasChanges) return <Text style={styles.text} selectable uiTextView
            selectionColor={colors.borderColor}>{props.history.characters.join(" ")}</Text>
        if (!tagCategories.characters) return null
        const tagCategory = tagCategories.characters.map((t) => t.tag)
        const addedTags = props.history.addedTags.filter((tag: string) => tagCategory.includes(tag))
        const removedTags = props.history.removedTags.filter((tag: string) => tagCategory.includes(tag))
        return calculateDiff(addedTags, removedTags)
    }

    const seriesDiff = () => {
        if (!hasChanges) return <Text style={styles.text} selectable uiTextView
            selectionColor={colors.borderColor}>{props.history.series.join(" ")}</Text>
        if (!tagCategories.series) return null
        const tagCategory = tagCategories.series.map((t) => t.tag)
        const addedTags = props.history.addedTags.filter((tag: string) => tagCategory.includes(tag))
        const removedTags = props.history.removedTags.filter((tag: string) => tagCategory.includes(tag))
        return calculateDiff(addedTags, removedTags)
    }

    const tagsDiff = () => {
        const removeArr = [...props.history.artists, ...props.history.characters, ...props.history.series]
        const filteredTags = props.history.tags.filter((tag: string) => !removeArr.includes(tag))
        if (!hasChanges) return <Text style={styles.text} selectable uiTextView
            selectionColor={colors.borderColor}>{filteredTags.join(" ")}</Text>
        let totalTags = [...(tagCategories.tags || []), ...(tagCategories.meta || [])]
        if (!totalTags.length) return null
        const tagCategory = totalTags.map((t) => t.tag)
        const addedTags = props.history.addedTags.filter((tag: string) => tagCategory.includes(tag))
        const removedTags = props.history.removedTags.filter((tag: string) => tagCategory.includes(tag))
        return calculateDiff(addedTags, removedTags)
    }

    const tagGroupsDiff = () => {
        if (!props.history.tagGroups?.length) return null
        if (!hasChanges) return <Text style={styles.text} selectable uiTextView
            selectionColor={colors.borderColor}>{props.history.tagGroups.map((g) => g?.name)?.join(" ")}</Text>
        const groupNames = props.history.tagGroups.map((g) => g?.name).filter(Boolean)
        const addedTagGroups = props.history.addedTagGroups.filter((tagGroup: string) => groupNames.includes(tagGroup))
        const removedTagGroups = props.history.removedTagGroups.filter((tagGroup: string) => groupNames.includes(tagGroup))
        return calculateDiff(addedTagGroups, removedTagGroups)
    }

    const printImageSources = () => {
        if (!props.history.imageSources) return "None"
        const entries = Object.entries(props.history.imageSources)
        return entries.map((entry, i) => {
            let [key, value] = entry
            let append = i !== entries.length - 1 ? ", " : ""
            return (
                <PressableHaptic onPress={() => openSource(value)}>
                    <Text style={styles.text}>{key + " → "}
                        {value ? <Text style={styles.changeText}>
                            {functions.util.getSiteName(value, i18n) + append}
                        </Text> : "none" + append}
                    </Text>
                </PressableHaptic>
            )
        })
    }

    const printImageLinks = () => {
        if (!props.history.imageLinks) return "None"
        const entries = Object.entries(props.history.imageLinks)
        return entries.map((entry, i) => {
            let [key, value] = entry
            let append = i !== entries.length - 1 ? ", " : ""
            return (
                <PressableHaptic onPress={() => openSource(value)}>
                <Text style={styles.text}>{key + " → "}
                    {value ? <Text style={styles.changeText}>
                        {functions.util.getSiteName(value, i18n) + append}
                    </Text> : "none" + append}
                </Text>
                </PressableHaptic>
            )
        })
    }

    const printMirrors = () => {
        if (!Object.values(props.history.mirrors ?? {}).length) return "None"
        const mapped = Object.values(props.history.mirrors ?? {}) as string[]
        return mapped.map((value, i) => {
            let append = i !== mapped.length - 1 ? ", " : ""
            return (
                <PressableHaptic onPress={() => openSource(value)}>
                    <Text style={styles.changeText}>{functions.util.getSiteName(value, i18n) + append}</Text>
                </PressableHaptic>
            )
        })
    }

    const dateTextJSX = () => {
        let firstHistory = props.index === Number(props.history.historyCount) - 1
        const targetDate = firstHistory ? props.history.uploadDate : props.history.date
        const editText = firstHistory ? i18n.time.uploaded : i18n.time.edited

        return functions.jsx.usernameJSX(props.history.user, 
            colors, i18n, navigation, styles.dateText, undefined, styles.dateContainer, editText, targetDate)
    }

    const diffJSX = () => {
        let jsx = [] as React.ReactElement[]
        let changes = props.history.changes || {}
        let tagChanges = props.history.addedTags?.length || props.history.removedTags?.length
        let tagGroupChanges = props.history.addedTagGroups?.length || props.history.removedTagGroups?.length

        if (changes.parentID !== undefined && !changes.parentID) {
            jsx.push(
            <View style={styles.rowContainer}>
                <Text style={styles.changeText} selectable uiTextView
                selectionColor={colors.borderColor}>[{i18n.labels.parentRemoved}]</Text>
            </View>)
        }
        if ((!hasChanges && props.history.images.length > 1) || changes.images) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.images}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.images.length}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.parentID) || changes.parentID) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openPost(props.history.parentID)}>
                    <Text style={styles.label}>{i18n.labels.parentID}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.parentID}</Text>
                </PressableHaptic>)
        }
        if (!hasChanges || changes.type) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sidebar.type}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{functions.util.toProperCase(props.history.type)}</Text>
                </View>)
        }
        if (!hasChanges || changes.rating) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sidebar.rating}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{functions.util.toProperCase(props.history.rating)}</Text>
                </View>)
        }
        if (!hasChanges || changes.style) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sidebar.style}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{functions.util.toProperCase(props.history.style)}</Text>
                </View>)
        }
        if (!hasChanges || tagChanges) {
            if (artistsDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.navbar.artists}:</Text>
                        <View style={styles.rowContainer}>{artistsDiff()}</View>
                    </View>)
            }
        }
        if (!hasChanges || tagChanges) {
            if (charactersDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.navbar.characters}:</Text>
                        <View style={styles.rowContainer}>{charactersDiff()}</View>
                    </View>)
            }
        }
        if (!hasChanges || tagChanges) {
            if (seriesDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.tag.series}:</Text>
                        <View style={styles.rowContainer}>{seriesDiff()}</View>
                    </View>)
            }
        }
        if (!hasChanges || tagChanges) {
            if (tagsDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.navbar.tags}:</Text>
                        <View style={styles.rowContainer}>{tagsDiff()}</View>
                    </View>)
            }
        }
        if (!hasChanges || tagGroupChanges) {
            if (tagGroupsDiff()) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.labels.tagGroups}:</Text>
                        <View style={styles.rowContainer}>{tagGroupsDiff()}</View>
                    </View>)
            }
        }
        if (!hasChanges || changes.title) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.title}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.title || i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.englishTitle) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.englishTitle}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.englishTitle || i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.artist) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.tag.artist}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.artist || i18n.labels.unknown}</Text>
                </View>)
        }
        if (!hasChanges || changes.posted) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sort.posted}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.posted ? functions.date.formatDate(new Date(props.history.posted)) : i18n.labels.unknown}</Text>
                </View>)
        }
        if (!hasChanges || changes.source) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openSource(props.history.source)}>
                    <Text style={styles.label}>{i18n.labels.source}:</Text>
                    <Text style={styles.changeText} selectable uiTextView
                    selectionColor={colors.borderColor}>{functions.util.getSiteName(props.history.source, i18n)}</Text>
                </PressableHaptic>)
        }
        if (!hasChanges || changes.userProfile) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openUserProfile(props.history.userProfile)}>
                    <Text style={styles.label}>{i18n.labels.userProfile}:</Text>
                    <Text style={styles.changeText} selectable uiTextView
                    selectionColor={colors.borderColor}>{functions.util.getSiteName(props.history.userProfile!, i18n)}</Text>
                </PressableHaptic>)
        }
        if (!hasChanges || changes.imageSources) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.imageSources}:</Text>
                    <Text style={styles.text}>{printImageSources()}</Text>
                </View>)
        }
        if (!hasChanges || changes.imageLinks) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.imageLinks}:</Text>
                    <Text style={styles.text}>{printImageLinks()}</Text>
                </View>)
        }
        if (!hasChanges || changes.mirrors) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.mirrors}:</Text>
                    <Text style={styles.text}>{printMirrors()}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.bookmarks) || changes.bookmarks) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sort.bookmarks}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.bookmarks || "?"}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.sourceImageCount) || changes.sourceImageCount) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.imageCount}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.sourceImageCount || "?"}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.pixivTags) || changes.pixivTags) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.pixivTags}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.pixivTags?.join(", ") || i18n.labels.none}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.drawingTools) || changes.drawingTools) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.drawingTools}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.drawingTools?.join(", ") || i18n.labels.none}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.buyLink) || changes.buyLink) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.buyLink}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.buyLink || i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.commentary) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.commentary}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.commentary || i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.englishCommentary) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.englishCommentary}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.englishCommentary || i18n.labels.none}</Text>
                </View>)
        }
        if (!jsx.length && !props.history.imageChanged) {
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
             </Pressable>
            <View style={styles.textContainer}>
                {historyOptions()}
                {dateTextJSX()}
                {props.history.imageChanged ? 
                <View style={styles.rowContainer}>
                    <Text style={styles.changeText} selectable uiTextView
                    selectionColor={colors.borderColor}>[{i18n.labels.imageUpdated}]</Text>
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

export default PostHistoryRow