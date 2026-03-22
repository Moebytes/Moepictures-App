/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import path from "path"
import {Platform, PermissionsAndroid} from "react-native"
import {saveDocuments} from "@react-native-documents/picker"
import {CameraRoll} from "@react-native-camera-roll/camera-roll"
import {Dirs, FileSystem as fs} from "react-native-file-access"
import functions from "./Functions"

const videoExtensions = [".mp4", ".webm", ".mov", ".mkv"]
const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac"]

export default class FileFunctions {
    public static requestStoragePermission = async () => {
        if (Platform.OS !== "android") return true

        if (Platform.Version >= 33) return true

        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        if (granted) return true

        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)

        return result === PermissionsAndroid.RESULTS.GRANTED
    }
    
    public static saveToCameraRoll = async (img: string, filename: string) => {
        const dir = Dirs.DocumentDir
        const dest = `file://${dir}/${filename}`

        try {
            await fs.fetch(img, {path: dest})
            await CameraRoll.saveAsset(dest)
        } finally {
            if (await fs.exists(dest)) {
                await fs.unlink(dest)
            }
        }
    }

    public static getMimeType = (filename: string) => {
        const mimeTypes: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            avif: "image/avif"
        }

        const ext = path.extname(filename).replace(".", "")
        return mimeTypes[ext] || "application/octet-stream"
    }

    public static saveToFiles = async (img: string, filename: string) => {
        const dir = Dirs.DocumentDir
        const dest = `file://${dir}/${filename}`

        try {
            await fs.fetch(img, {path: dest})
            await saveDocuments({sourceUris: [dest], copy: true, fileName: filename, mimeType: this.getMimeType(filename)})
        } finally {
            if (await fs.exists(dest)) {
                await fs.unlink(dest)
            }
        }
    }

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