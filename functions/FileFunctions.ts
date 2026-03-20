/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import path from "path"
import {Platform, PermissionsAndroid} from "react-native"
import {saveDocuments} from "@react-native-documents/picker"
import {CameraRoll} from "@react-native-camera-roll/camera-roll"
import fs from "react-native-fs"
import functions from "./Functions"

const videoExtensions = [".mp4", ".webm", ".mov", ".mkv"]
const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac"]

export default class FileFunctions {
    public static requestStoragePermission = async () => {
        if (Platform.OS !== "android") return true

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )

        return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    
    public static saveToCameraRoll = async (img: string, filename: string) => {
        const dir = fs.TemporaryDirectoryPath
        let protocol = Platform.OS === "android" ? "content://" : "file://"
        const dest = `${protocol}${dir}/${filename}`

        try {
            await fs.downloadFile({fromUrl: img, toFile: dest}).promise
            await CameraRoll.saveAsset(dest)
        } finally {
            if (await fs.exists(dest)) {
                await fs.unlink(dest)
            }
        }
    }

    public static saveToFiles = async (img: string, filename: string) => {
        const dir = fs.TemporaryDirectoryPath
        let protocol = Platform.OS === "android" ? "content://" : "file://"
        const dest = `${protocol}${dir}/${filename}`

        try {
            await fs.downloadFile({fromUrl: img, toFile: dest}).promise
            await saveDocuments({sourceUris: [dest], copy: true, fileName: filename})
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