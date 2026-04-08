/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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

    public static trimStartNewline = (text: string) => {
        return text.replace(/^\n+/, "")
    }
}