/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect, useReducer} from "react"
import {ScrollView, View, Image, TextInput, FlatList} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import ScalableHaptic from "./ScalableHaptic"
import PressableHaptic from "./PressableHaptic"
import {useCacheSelector, useFlagActions, useFlagSelector, useLayoutActions, useSessionSelector, useThemeSelector} from "../store"
import HighlightIcon from "../assets/svg/highlight.svg"
import BoldIcon from "../assets/svg/bold.svg"
import ItalicIcon from "../assets/svg/italic.svg"
import UnderlineIcon from "../assets/svg/underline.svg"
import StrikethroughIcon from "../assets/svg/strikethrough.svg"
import SpoilerIcon from "../assets/svg/spoiler.svg"
import LinkIcon from "../assets/svg/link-thick.svg"
import DetailsIcon from "../assets/svg/details.svg"
import HexcolorIcon from "../assets/svg/hash.svg"
import CodeblockIcon from "../assets/svg/codeblock.svg"
import {createStylesheet} from "./styles/TextBox.styles"
import functions from "../functions/Functions"
import moeText from "../moetext/MoeText"

export interface TextBoxRef {
    getText: () => string
    updateText: (text: string) => void
    showError: (msg: string) => void
    clearError: () => void
    scrollToPosition: (listRef: React.RefObject<FlatList | null>) => void
}

interface Props {
    onPost: (text: string) => Promise<void>
}

const TextBox = forwardRef<TextBoxRef, Props>((props, ref) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setEmojiStripVisible} = useLayoutActions()
    const {emojis} = useCacheSelector()
    const {emojiFlag} = useFlagSelector()
    const {setEmojiFlag} = useFlagActions()
    const [text, setText] = useState("")
    const [error, setError] = useState("")
    const [previewMode, setPreviewMode] = useState(false)
    const [previewText, setPreviewText] = useState("")
    const styles = createStylesheet(colors)
    const [selection, setSelection] = useState({start: 0, end: 0})
    const containerRef = useRef<View>(null)
    const inputRef = useRef<TextInput>(null)

    useImperativeHandle(ref, () => ({
        getText: () => {
            return text
        },
        updateText: (text: string) => {
            setText(text)
        },
        showError: async (msg: string) => {
            setError(msg)
        },
        clearError: () => {
            setError("")
        },
        scrollToPosition: (listRef: React.RefObject<FlatList | null>) => {
            const scrollNode = listRef.current?.getNativeScrollRef() as any

            requestAnimationFrame(() => {
                containerRef.current?.measureLayout(scrollNode, (x, y) => {
                    listRef.current?.scrollToOffset({
                        offset: Math.max(0, y - 200),
                        animated: true
                    })
                })
            })
        }
    }))

    const onPost = async () => {
        const replaced = await moeText.linkReplacements(text, session)
        props.onPost(replaced)
    }

    useEffect(() => {
        const updatePreviewText = async () => {
            const replaced = await moeText.linkReplacements(text, session)
            setPreviewText(replaced)
        }
        updatePreviewText()
    }, [previewMode, text])

    useEffect(() => {
        if (emojiFlag) {
            const insert = ` :${emojiFlag}:`
            const newCursor = selection.start + insert.length
            setText((prev: string) => prev + insert)
            setSelection({start: newCursor, end: newCursor})
            setEmojiFlag("")
        }
    }, [emojiFlag])

    const buttonPress = (type: string) => {
        functions.render.triggerTextBoxButton(inputRef, text, setText, selection, setSelection, type)
    }

    const previewElements = () => {
        let fragment = moeText.renderText(previewText, emojis, colors)[0] as React.ReactElement<React.FragmentProps>
        const rendered = fragment.props.children as React.ReactElement[]
        return rendered.map((element: any, index: number) => {
            if (element.type === Text) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {fontSize: 20}]
                })
            }

            if (element.type === Image) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {width: 35, height: 35}]
                })
            }

            return element
        })
    }

    let iconSize = 22

    const getTextBox = () => {
        if (session.banned) {
            return (
                <Text style={styles.banText} selectable uiTextView
                    selectionColor={colors.borderColor}>{i18n.pages.comment.banned}</Text>
            )
        }
        if (session.username) {
            return (
                <View style={styles.textboxContainer} ref={containerRef}>
                    <View style={styles.textbox}>
                        <View style={styles.textboxButtonContainer}>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("highlight")}>
                                <HighlightIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("bold")}>
                                <BoldIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("italic")}>
                                <ItalicIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("underline")}>
                                <UnderlineIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("strikethrough")}>
                                <StrikethroughIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("spoiler")}>
                                <SpoilerIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("link")}>
                                <LinkIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("details")}>
                                <DetailsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("color")}>
                                <HexcolorIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                            <ScalableHaptic style={styles.textboxButton} onPress={() => buttonPress("code")}>
                                <CodeblockIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                            </ScalableHaptic>
                        </View>
                        {previewMode ? 
                        <ScrollView showsVerticalScrollIndicator={false} style={{height: 150}}
                            contentContainerStyle={styles.previewContainer}>{previewElements()}</ScrollView> :
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            selectionColor={colors.borderColor}
                            onFocus={() => setEmojiStripVisible(true)}
                            onBlur={() => setEmojiStripVisible(false)}
                            selection={selection}
                            onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                            value={text}
                            onChangeText={setText}
                            multiline={true}
                            submitBehavior="blurAndSubmit"
                            textAlignVertical="top"/>}
                    </View>
                    {error ? <View style={styles.buttonContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View> : null}
                    <View style={styles.buttonContainer}>
                        <PressableHaptic onPress={() => setPreviewMode((prev: boolean) => !prev)} style={({pressed}) => [
                            styles.button, pressed && styles.buttonActive,
                            {backgroundColor: previewMode ? colors.editColor : colors.previewColor}
                        ]}>{({pressed}) => (
                            <Text style={[styles.buttonText, 
                                pressed && styles.buttonTextActive]}>
                                    {previewMode ? i18n.buttons.unpreview : i18n.buttons.preview}
                            </Text>
                        )}
                        </PressableHaptic>

                        <PressableHaptic onPress={onPost} style={({pressed}) => [
                            styles.button, pressed && styles.buttonActive
                        ]}>{({pressed}) => (
                            <Text style={[styles.buttonText, 
                                pressed && styles.buttonTextActive]}>{i18n.buttons.post}</Text>
                        )}
                        </PressableHaptic>
                    </View>
                </View>
            )
        }
    }

    return (
        <>
        {getTextBox()}
        </>
    )
})

export default TextBox