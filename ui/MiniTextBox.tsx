/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from "react"
import {ScrollView, View, Image, TextInput} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import ScalableHaptic from "./ScalableHaptic"
import {useCacheSelector, useFlagActions, useFlagSelector, useLayoutActions, 
useSessionSelector, useThemeSelector} from "../store"
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
import {createStylesheet} from "./styles/MiniTextBox.styles"
import functions from "../functions/Functions"
import moeText from "../moetext/MoeText"

export interface MiniTextBoxRef {
    resolveReplacements: () => Promise<string>
    togglePreviewMode: () => void
    getPreviewMode: () => boolean
    showError: (msg: string) => void
    clearError: () => void
}

interface Props {
    text: string
    setText: (text: string) => void
    opaque?: boolean
}

const MiniTextBox = forwardRef<MiniTextBoxRef, Props>((props, ref) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {setEmojiStripVisible} = useLayoutActions()
    const {emojis} = useCacheSelector()
    const {emojiFlag} = useFlagSelector()
    const {setEmojiFlag} = useFlagActions()
    const [error, setError] = useState("")
    const [previewMode, setPreviewMode] = useState(false)
    const [previewText, setPreviewText] = useState("")
    const styles = createStylesheet(colors)
    const [selection, setSelection] = useState({start: 0, end: 0})
    const containerRef = useRef<View>(null)
    const inputRef = useRef<TextInput>(null)

    useImperativeHandle(ref, () => ({
        resolveReplacements: async () => {
            const replaced = await moeText.linkReplacements(props.text, session)
            return replaced
        },
        togglePreviewMode: () => {
            setPreviewMode((prev: boolean) => !prev)
        },
        getPreviewMode: () => {
            return previewMode
        },
        showError: async (msg: string) => {
            setError(msg)
        },
        clearError: () => {
            setError("")
        }
    }))

    useEffect(() => {
        const updatePreviewText = async () => {
            const replaced = await moeText.linkReplacements(props.text, session)
            setPreviewText(replaced)
        }
        updatePreviewText()
    }, [previewMode])

    useEffect(() => {
        if (emojiFlag) {
            const insert = ` :${emojiFlag}:`
            const newCursor = selection.start + insert.length
            props.setText(props.text + insert)
            setSelection({start: newCursor, end: newCursor})
            setEmojiFlag("")
        }
    }, [emojiFlag])

    const buttonPress = (type: string) => {
        functions.render.triggerTextBoxButton(inputRef, props.text, props.setText, selection, setSelection, type)
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

    let iconSize = 20
    let bgColor = {backgroundColor: props.opaque ? colors.background : "transparent"}

    const getTextBox = () => {
        return (
            <View style={styles.textboxContainer} ref={containerRef}>
                <View style={styles.textbox}>
                    <View style={[styles.textboxButtonContainer, bgColor]}>
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
                    <ScrollView showsVerticalScrollIndicator={false} style={[{width: "100%", height: 100}, bgColor]}
                        contentContainerStyle={styles.previewContainer}>{previewElements()}</ScrollView> :
                    <TextInput
                        ref={inputRef}
                        style={[styles.textInput, bgColor]}
                        selectionColor={colors.borderColor}
                        onFocus={() => setEmojiStripVisible(true)}
                        onBlur={() => setEmojiStripVisible(false)}
                        selection={selection}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        value={props.text}
                        onChangeText={props.setText}
                        multiline={true}
                        submitBehavior="blurAndSubmit"
                        textAlignVertical="top"/>}
                </View>
                {error ? <View style={styles.buttonContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View> : null}
            </View>
        )
    }

    return (
        <>
        {getTextBox()}
        </>
    )
})

export default MiniTextBox