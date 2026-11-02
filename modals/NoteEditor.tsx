/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {memo, useEffect, useMemo, useState} from "react"
import {View, Text, Pressable, ScrollView, StyleSheet} from "react-native"
import {G, Rect, Text as SVGText} from "react-native-svg"
import {ShapeEditor, wrapShape, ShapeRenderProps} from "react-native-shape-editor"
import {useSessionSelector, useThemeSelector} from "../store"
import {Note} from "../types/Types"
import {createStylesheet} from "./styles/NoteEditor.styles"

interface Props {
    notes: Note[]
    visible: boolean
    imageWidth: number
    imageHeight: number
    width: number
    height: number
}

interface NoteProps extends Note {
    selected: boolean
    color: string
    lines: string[]
}

const NoteShape = wrapShape<NoteProps>((props: ShapeRenderProps & NoteProps) => {
    const {width, height, overlay, selected, color,
        fontFamily, bold, italic, backgroundColor, backgroundAlpha,
        character, strokeColor, textColor,
        fontSize, strokeWidth, borderRadius, lines} = props
    const lineHeight = fontSize * 1.2
    const textY = (height - lines.length * lineHeight) / 2 + fontSize

    const textProps = {
        x: width / 2,
        textAnchor: "middle" as const,
        fontSize,
        fontFamily: fontFamily || undefined,
        fontWeight: bold ? "bold" as const : "normal" as const,
        fontStyle: italic ? "italic" as const : "normal" as const
    }

    return (
        <G>
        <Rect width={width} height={height}
            fill={overlay ? backgroundColor || "#ffffff" : character ? "transparent" : color}
            fillOpacity={overlay ? (backgroundAlpha ?? 100) / 100 : character ? 0 : 0.1}
            stroke={overlay || (character && !selected) ? "none" : color}
            strokeWidth={1} strokeDasharray={overlay ? undefined : [4, 4]}
            rx={overlay ? borderRadius : 0} ry={overlay ? borderRadius : 0}/>

        {overlay && lines.map((line, index) => (
            <G key={index}>
                {strokeWidth > 0 && <SVGText {...textProps} y={textY + index * lineHeight}
                    fill={strokeColor || "#ffffff"} stroke={strokeColor || "#ffffff"}
                    strokeWidth={strokeWidth} strokeLinejoin="round">{line}</SVGText>}
                <SVGText {...textProps} y={textY + index * lineHeight}
                    fill={textColor || "#000000"}>{line}</SVGText>
            </G>
        ))}
        </G>
    )
})

const NoteEditor: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const {session} = useSessionSelector()
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [textLines, setTextLines] = useState<{[key: number]: string[]}>({})
    const [bubbleHeight, setBubbleHeight] = useState(0)

    useEffect(() => {
        if (!props.visible) setActiveIndex(null)
    }, [props.visible])

    const notes = useMemo(() => props.notes.map((note) => {
        const scaleX = props.width / (note.imageWidth || props.imageWidth)
        const scaleY = props.height / (note.imageHeight || props.imageHeight)

        return {
            ...note,
            x: note.x * scaleX,
            y: note.y * scaleY,
            width: note.width * scaleX,
            height: note.height * scaleY,
            fontSize: (note.fontSize || 100) * scaleY,
            strokeWidth: (note.strokeWidth ?? 0) * scaleY,
            borderRadius: (note.borderRadius ?? 0) * scaleY,
            overlay: !note.character && note.overlay && !session.forceNoteBubbles
        }
    }), [props.notes, props.width, props.height, props.imageWidth, props.imageHeight, session.forceNoteBubbles])

    if (props.width <= 0 || props.height <= 0 ||
        props.imageWidth <= 0 || props.imageHeight <= 0) return null

    const activeNote = activeIndex === null ? undefined : notes[activeIndex]

    const bubbleWidth = activeNote?.character
        ? Math.min(props.width, Math.max(125, activeNote.width))
        : Math.min(props.width, Math.max(160, Math.min(280, activeNote?.width || 0)))

    const bubbleLeft = Math.max(0, Math.min(props.width - bubbleWidth, activeNote?.x || 0))
    const maxBubbleHeight = Math.min(240, props.height)
    const measuredHeight = Math.min(bubbleHeight || maxBubbleHeight, maxBubbleHeight)
    const bubbleBelow = (activeNote?.y || 0) + (activeNote?.height || 0) + 5

    const bubbleTop = Math.max(0, Math.min(props.height - measuredHeight,
        activeNote?.character || bubbleBelow + measuredHeight > props.height
            ? (activeNote?.y || 0) - measuredHeight - 5 : bubbleBelow))

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setActiveIndex(null)}/>
            <ShapeEditor vectorWidth={props.width} vectorHeight={props.height} scale={1}
                pointerEvents="none" focusOnAdd={false} focusOnDelete={false}>
                {notes.map((note, index) => (
                    <NoteShape key={index} shapeId={String(index)} disabled
                        {...note} rotation={note.rotation || 0}
                        selected={activeIndex === index} color={colors.iconColor}
                        lines={textLines[index] || []}/>
                ))}
            </ShapeEditor>

            {notes.map((note, index) => note.overlay ? (
                <Text key={index} pointerEvents="none" allowFontScaling={false}
                    style={{position: "absolute", opacity: 0, width: Math.max(1, note.width - note.fontSize / 5),
                        fontSize: note.fontSize, lineHeight: note.fontSize * 1.2,
                        fontFamily: note.fontFamily || undefined,
                        fontWeight: note.bold ? "bold" : "normal",
                        fontStyle: note.italic ? "italic" : "normal"}}
                    onTextLayout={({nativeEvent}) => {
                        const lines = nativeEvent.lines.map((line) => line.text.replace(/\u200b/g, "").replace(/\n$/, ""))
                        setTextLines((prev) => JSON.stringify(prev[index]) === JSON.stringify(lines) ? prev : {...prev, [index]: lines})
                    }}>
                    {note.breakWord ? note.translation : Array.from(note.translation || "").join("\u200b")}
                </Text>
            ) : (
                <Pressable key={index}
                    style={{position: "absolute", left: note.x, top: note.y,
                        width: note.width, height: note.height,
                        transform: [{rotate: `${note.character ? 0 : note.rotation || 0}deg`}]}}
                    onPress={() => {
                        setBubbleHeight(0)
                        setActiveIndex(activeIndex === index ? null : index)
                    }}/>
            ))}

            {activeNote && 
            <View style={[styles.popup, activeNote.character ? styles.characterBubble : styles.bubble,
                {left: bubbleLeft, top: bubbleTop, width: bubbleWidth, maxHeight: maxBubbleHeight}]}
                onLayout={({nativeEvent}) => setBubbleHeight(nativeEvent.layout.height)}>
                <ScrollView style={{maxHeight: maxBubbleHeight - (activeNote.character ? 0 : 2)}}
                    contentContainerStyle={activeNote.character ? styles.characterContent : styles.bubbleContent}>
                    <Text selectable style={activeNote.character ? styles.characterText : [styles.bubbleText, {
                        fontFamily: activeNote.fontFamily || undefined,
                        fontWeight: activeNote.bold ? "bold" : "normal",
                        fontStyle: activeNote.italic ? "italic" : "normal"
                    }]}>
                    {activeNote.character ? activeNote.characterTag?.replace(/-/g, " ") : activeNote.translation}
                    </Text>
                </ScrollView>
            </View>}
        </View>
    )
}

export default memo(NoteEditor)