/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"

export default class CryptoFunctions {
    public static isEncrypted = (buffer: ArrayBuffer | Buffer, link: string) => {
        const result = functions.byte.bufferFileType(buffer)
        if (result.length) {
            if (result[0].typename === "mp3" && !functions.file.isAudio(link)) return true
            if (result[0].typename === "exe") return true
            if (result[0].typename === "pic") return true
            if (result[0].typename === "mpeg") return true
            if (result[0].typename === "Json") return true
            return false
        }
        return true
    }
}