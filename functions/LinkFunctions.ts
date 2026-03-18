/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import {Session, Image} from "../types/Types"

let baseURL = "https://moepictures.net"

export default class LinkFunctions {
    public static getImageLink = (image: Image, upscaled?: boolean) => {
        if (!image.filename && !image.upscaledFilename) return ""
        let filename = upscaled ? image.upscaledFilename || image.filename : image.filename
        const link = `${baseURL}/${image.type}/${image.postID}-${image.order}-${encodeURIComponent(filename)}`
        return functions.util.appendURLParams(link, {hash: image.pixelHash})
    }

    public static getThumbnailLink = (image: Image, sizeType: string, session: Session, mobile?: boolean, forceLive?: boolean) => {
        if (!image.thumbnail && !image.filename) return ""
        let originalFilename = `${image.postID}-${image.order}-${encodeURIComponent(image.filename)}`
        let filename = image.thumbnail || originalFilename
        if (forceLive) return this.getImageLink(image, false)
        if (image.type === "image" || image.type === "comic") {
            if (sizeType === "massive" && !mobile) {
                return this.getImageLink(image, false)
            }
        }
        if (image.type === "animation" || image.type === "video") {
            if (session.liveAnimationPreview && !mobile && !functions.file.isZip(originalFilename)) return this.getImageLink(image, false)
        }
        if (image.type === "model" || image.type === "live2d") {
            if (session.liveModelPreview && !mobile) return this.getImageLink(image, false)
        }
        const link = `${baseURL}/thumbnail/${image.type}/${encodeURIComponent(filename)}`
        return functions.util.appendURLParams(link, {hash: image.pixelHash})
    }

    public static getTagLink = (folder: string, filename: string | null, hash: string | null) => {
        if (!filename) return ""
        let dest = "tag"
        if (folder === "artist") dest = "artist"
        if (folder === "character") dest = "character"
        if (folder === "series") dest = "series"
        if (folder === "pfp") dest = "pfp"
        if (!folder || filename.includes("history/")) return `${baseURL}/${filename}`
        const link = `${baseURL}/${dest}/${encodeURIComponent(filename)}`
        return hash ? functions.util.appendURLParams(link, {hash: hash}) : link
    }
}