/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable, useWindowDimensions, Image, Alert} from "react-native"
import {UITextView as Text} from "@bsky.app/react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {useInvalidateTag} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/HistoryRow.styles"
import RevertIcon from "../../assets/svg/revert.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import FilterImage from "../image/FilterImage"
import {TagHistory} from "../../types/Types"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

const pixiv = require("../../assets/icons/pixiv.png")
const twitter = require("../../assets/icons/twitter.png")
const website = require("../../assets/icons/website.png")
const wikipedia = require("../../assets/icons/wikipedia.png")
const fandom = require("../../assets/icons/fandom.png")

interface Props {
    history: TagHistory
    currentHistory: TagHistory
    previousHistory: TagHistory | null
    index: number
    refetch: () => void
}

const TagHistoryRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const styles = createStylesheet(colors)
    const [img, setImg] = useState("")
    const navigation = useNavigation()
    let hasChanges = functions.compare.hasHistoryChanges(props.history)
    const invalidateTag = useInvalidateTag()

    useEffect(() => {
        const updateImage = async () => {
            if (!props.history?.image) return
            const img = functions.link.getTagLink(props.history)
            setImg(img)
        }
        updateImage()
    }, [props.history])

    useEffect(() => {
        const updateSize = async () => {
            if (!img) return
            const size = await functions.image.dynamicResize({uri: img}, 100, width)
            setSize(size)
        }
        updateSize()
    }, [img])

    const onPress = () => {
        let historyID = props.history.historyID === props.currentHistory.historyID ? "" : props.history.historyID
        navigation.navigate("Tag", {name: props.history.tag, historyID})
    }

    const openLink = (link: string | null) => {
        functions.link.openSocialLink(link)
    }

    const revertHistory = () => {
        Alert.alert(i18n.dialogs.revertTagHistory.title, i18n.dialogs.revertGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.revert, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                let image = null as number[] | ["delete"] | null
                if (!props.history.image) {
                    image = ["delete"]
                } else {
                    const imageLink = functions.link.getTagLink(props.history)
                    const arrayBuffer = await functions.http.getBuffer(imageLink)
                    const bytes = new Uint8Array(arrayBuffer)
                    image = Object.values(bytes)
                }
                await functions.http.put("/api/tag/edit", {tag: props.history.tag, key: props.history.key, description: props.history.description, image, 
                aliases: props.history.aliases, implications: props.history.implications, pixivTags: props.history.pixivTags, danbooruTag: props.history.danbooruTag, 
                social: props.history.social, twitter: props.history.twitter, website: props.history.website, fandom: props.history.fandom, 
                wikipedia: props.history.wikipedia, type: props.history.type, r18: props.history.r18 ?? false, 
                featuredPost: props.history.featuredPost?.postID}, session)

                navigation.navigate("TagHistory", {name: props.history.key}, {pop: true})
                invalidateTag(props.history.tag)
                props.refetch()
            }}
        ], {cancelable: true})
    }

    const deleteHistory = () => {
        Alert.alert(i18n.dialogs.deleteTagHistory.title, i18n.dialogs.deleteGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                if (props.history.historyID === props.currentHistory.historyID) return
                await functions.http.delete("/api/tag/history/delete", {tag: props.history.tag, historyID: props.history.historyID}, session)
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

    const socialIcons = () => {
        let jsx = [] as React.ReactElement[]
        if (!props.history) return jsx
        if (props.history.website) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.history.website)}>
                    <Image style={styles.icon} source={website}/>
                </ScalableHaptic>
            )
        }
        if (props.history.fandom) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.history.fandom)}>
                    <Image style={styles.icon} source={fandom}/>
                </ScalableHaptic>
            )
        }
        if (props.history.social) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.history.social)}>
                    <Image style={styles.icon} source={pixiv}/>
                </ScalableHaptic>
            )
        }
        if (props.history.twitter) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.history.twitter)}>
                    <Image style={styles.icon} source={twitter}/>
                </ScalableHaptic>
            )
        }
        if (props.history.wikipedia) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.history.wikipedia)}>
                    <Image style={styles.icon} source={wikipedia}/>
                </ScalableHaptic>
            )
        }
        return jsx
    }

    const dateTextJSX = () => {
        let firstHistory = props.index === Number(props.history.historyCount) - 1
        let targetDate = props.history.date
        const editText = firstHistory ? i18n.time.created : i18n.time.edited

        return functions.jsx.usernameJSX(props.history.user, 
            colors, i18n, navigation, styles.dateText, undefined, styles.dateContainer, editText, targetDate)
    }

    const descriptionDiffJSX = () => {
        let newDescription = props.history.description || i18n.labels.none
        if (!hasChanges) return <Text style={styles.text}>{newDescription}</Text>
        let oldDescription = props.previousHistory?.description || i18n.labels.none
    
        const oldWords = oldDescription.split(/([^\s\n]+|\s+|\n)/g).filter(Boolean)
        const newWords = newDescription.split(/([^\s\n]+|\s+|\n)/g).filter(Boolean)
    
        // Longest Common Subsequence (LCS) algorithm
        const lcs = (a: string[], b: string[]) => {
            const dp = Array(a.length + 1)
                .fill(null)
                .map(() => Array(b.length + 1).fill(0))
    
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    if (a[i - 1] === b[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
                    }
                }
            }
    
            const sequence: [number, number][] = []
            let i = a.length
            let j = b.length
            while (i > 0 && j > 0) {
                if (a[i - 1] === b[j - 1]) {
                    sequence.unshift([i - 1, j - 1])
                    i--
                    j--
                } else if (dp[i - 1][j] > dp[i][j - 1]) {
                    i--
                } else {
                    j--
                }
            }
            return sequence
        }
    
        const sequence = lcs(oldWords, newWords)
        let result: React.ReactElement[] = []
        let i = 0
        let j = 0
        sequence.forEach(([oldIndex, newIndex]) => {
            while (i < oldIndex) {
                result.push(<Text style={styles.tagRemove} key={`remove-${i}`}>{oldWords[i]}</Text>)
                i++
            }
            while (j < newIndex) {
                result.push(<Text style={styles.tagAdd} key={`add-${j}`}>{newWords[j]}</Text>)
                j++
            }
            result.push(<Text style={styles.text} key={`unchanged-${i}`}>{oldWords[i]}</Text>)
            i++
            j++
        })
        while (i < oldWords.length) {
            result.push(<Text style={styles.tagRemove} key={`remove-${i}`}>{oldWords[i]}</Text>)
            i++
        }
        while (j < newWords.length) {
            result.push(<Text style={styles.tagAdd} key={`add-${j}`}>{newWords[j]}</Text>)
            j++
        }
        return <Text style={styles.text}>{result}</Text>
    }

    const diffJSX = () => {
        let jsx = [] as React.ReactElement[]
        let changes = props.history.changes || {}

        if (changes.type) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.category}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.type}</Text>
                </View>)
        }
        if (!hasChanges || changes.tag) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.name}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.tag}</Text>
                </View>)
        }
        if (!hasChanges || changes.description) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.description}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{descriptionDiffJSX()}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.website) || changes.website) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openLink(props.history.website)}>
                    <Text style={styles.label}>{i18n.labels.website}:</Text>
                    <Text style={styles.changeText}>{props.history.website}</Text>
                </PressableHaptic>)
        }
        if ((!hasChanges && props.history.social) || changes.social) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openLink(props.history.social)}>
                    <Text style={styles.label}>{i18n.labels.social}:</Text>
                    <Text style={styles.changeText}>{props.history.social}</Text>
                </PressableHaptic>)
        }
        if ((!hasChanges && props.history.twitter) || changes.twitter) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openLink(props.history.twitter)}>
                    <Text style={styles.label}>{i18n.labels.twitter}:</Text>
                    <Text style={styles.changeText}>{props.history.twitter}</Text>
                </PressableHaptic>)
        }
        if ((!hasChanges && props.history.fandom) || changes.fandom) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openLink(props.history.fandom)}>
                    <Text style={styles.label}>{i18n.labels.fandom}:</Text>
                    <Text style={styles.changeText}>{props.history.fandom}</Text>
                </PressableHaptic>)
        }
        if ((!hasChanges && props.history.wikipedia) || changes.wikipedia) {
            jsx.push(
                <PressableHaptic style={styles.rowContainer} onPress={() => openLink(props.history.wikipedia)}>
                    <Text style={styles.label}>{i18n.labels.wikipedia}:</Text>
                    <Text style={styles.changeText}>{props.history.wikipedia}</Text>
                </PressableHaptic>)
        }
        if (!hasChanges || changes.aliases) {
            const aliases = props.history.aliases.map((a) => a?.replace(/-/g, " ")).filter(Boolean)
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.sort.aliases}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{aliases.length ? aliases.join(", ") : i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.implications) {
            const implications = props.history.implications.map((i) => i?.replace(/-/g, " ")).filter(Boolean)
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.implications}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{implications.length ? implications.join(", ") : i18n.labels.none}</Text>
                </View>)
        }
        if (!hasChanges || changes.pixivTags) {
            if (props.history.pixivTags?.[0]) {
                jsx.push(
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{i18n.labels.pixivTags}:</Text>
                        <Text style={styles.text} selectable uiTextView
                        selectionColor={colors.borderColor}>{props.history.pixivTags.join(", ")}</Text>
                    </View>)
            }
        }
        if ((!hasChanges && props.history.danbooruTag) || changes.danbooruTag) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.danbooruTag}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.danbooruTag}</Text>
                </View>)
        }
        if ((!hasChanges && props.history.featuredPost) || changes.featuredPost) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{i18n.labels.featured}:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.featuredPost?.postID}</Text>
                </View>)
        }
        if (session.showR18 && ((!hasChanges && props.history.r18) || changes.r18)) {
            jsx.push(
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>R18:</Text>
                    <Text style={styles.text} selectable uiTextView
                    selectionColor={colors.borderColor}>{props.history.r18 ? i18n.buttons.yes : i18n.buttons.no}</Text>
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

    return (
        <View style={styles.container}>
            <Pressable style={styles.imageContainer} onPress={onPress}>
                {img ? <FilterImage img={img} size={size}/> : null}
                <Text style={[styles.title, {color: functions.tag.getTagColor(props.history, colors)}]}>{functions.util.toProperCase(props.history.key.replace(/-/g, " "))}</Text>
                <View style={[styles.rowContainer, {marginTop: 20}]}>{socialIcons()}</View>
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

export default TagHistoryRow