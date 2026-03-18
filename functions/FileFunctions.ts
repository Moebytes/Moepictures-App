/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import path from "path"
import functions from "./Functions"

const videoExtensions = [".mp4", ".webm", ".mov", ".mkv"]
const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac"]

export default class FileFunctions {
    public static isVideo = (file?: string) => {
        if (!file) return false
        file = file.replace(/\?.*$/, "")
        if (file?.startsWith("blob:")) {
            const ext = file.split("#")?.[1] || ""
            return functions.util.arrayIncludes(ext, videoExtensions)
        }
        const ext = file.startsWith(".") ? file : path.extname(file)
        return functions.util.arrayIncludes(ext, videoExtensions)
    }

    public static isAudio = (file?: string) => {
        if (!file) return false
        file = file.replace(/\?.*$/, "")
        if (file?.startsWith("blob:")) {
            const ext = file.split("#")?.[1] || ""
            return functions.util.arrayIncludes(ext, audioExtensions)
        }
        const ext = file.startsWith(".") ? file : path.extname(file)
        return functions.util.arrayIncludes(ext, audioExtensions)
    }

    public static isZip = (file?: string) => {
        if (!file) return false
        file = file.replace(/\?.*$/, "")
        if (file?.startsWith("blob:")) {
            const ext = file.split("#")?.[1] || ""
            return ext === ".zip"
        }
        const ext = file.startsWith(".") ? file : path.extname(file)
        return ext === ".zip"
    }
}