/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {TextInput} from "react-native"
type Selection = {start: number, end: number}

export default class RenderFunctions {
    public static parsePieces = (text: string) => {
        let segments = [] as string[]
        const pieces = text.split(/\n/gm)
        let intermediate = [] as string[]
        let codeBlock = false
        let detailsBlock = false
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i] + "\n"

            if (piece.includes("```")) {
                codeBlock = !codeBlock
                if (!codeBlock) {
                    intermediate.push(piece)
                    piece = ""
                }
            }

            if (piece.includes("<<")) {
                detailsBlock = true
            }
            if (piece.includes("||>>")) {
                detailsBlock = false
                intermediate.push(piece)
                piece = ""
            }

            if (codeBlock || detailsBlock || piece.startsWith(">>>") || piece.startsWith(">")) {
                if (codeBlock && !piece.includes("```")) piece += "\n"
                intermediate.push(piece)
            } else {
                if (intermediate.length) {
                    segments.push(intermediate.join(""))
                    intermediate = []
                }
                segments.push(piece)
            }
        }
        if (intermediate.length) {
            segments.push(intermediate.join(""))
        }
        return segments.filter(Boolean)
    }

    public static triggerTextBoxButton = (inputRef: React.RefObject<TextInput | null>, 
        text: string, setText: (text: string) => void, selection: Selection, 
        setSelection: (selection: Selection) => void, type: string) => {
        const insert = {
            highlight: "====",
            bold: "****",
            italic: "////",
            underline: "____",
            strikethrough: "~~~~",
            spoiler: "||||",
            link: "[]()",
            details: "<<||||>>",
            color: "#ff17c1{}",
            code: "``````"
        }[type]
        if (!insert) return

        const start = selection.start
        const end = selection.end
        const isSelected = start !== end
        let updated = ""

        let cursor = start

        if (isSelected) {
            let before = text.slice(0, start)
            let selected = text.slice(start, end)
            let after = text.slice(end)

            let half = Math.floor(insert.length / 2)
            let first = insert.slice(0, half)
            let second = insert.slice(half)

            if (type === "link") {
                if (selected.startsWith("http")) {
                    first = "[]"
                    second = `(${selected})`
                    selected = ""
                } else {
                    first = `[${selected}]`
                    second = "()"
                    selected = ""
                }
            }

            if (type === "color") {
                first = "#ff17c1{"
                second = "}"
            }

            updated = before + first + selected + second + after
            cursor = start + first.length + selected.length + second.length
        } else {
            const before = text.slice(0, start)
            const after = text.slice(start)

            updated = before + insert + after
            let shift = -2
            if (type === "link") shift = -3
            if (type === "details") shift = -6
            if (type === "color") shift = -1
            if (type === "code") shift = -3

            cursor = start + insert.length + shift
        }

        setText(updated)

        requestAnimationFrame(() => {
            inputRef.current?.focus()

            requestAnimationFrame(() => {
                setSelection({start: cursor, end: cursor})
            })
        })
    }

    public static trimStartNewline = (text: string) => {
        return text.replace(/^\n+/, "")
    }
}