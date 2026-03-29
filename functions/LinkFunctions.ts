/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import {Session, Image, Tag, TagCount, MiniTag} from "../types/Types"
import {siteURL} from "../ui/site"

export default class LinkFunctions {
    public static getImageLink = (image: Image, upscaled?: boolean) => {
        if (!image.filename && !image.upscaledFilename) return ""
        let filename = upscaled ? image.upscaledFilename || image.filename : image.filename
        if (upscaled && image.upscaledImageLink) return image.upscaledImageLink
        if (image.imageLink) return image.imageLink
        const link = `${siteURL}/${image.type}/${image.postID}-${image.order}-${encodeURIComponent(filename)}`
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
        if (image.thumbLink) return image.thumbLink
        const link = `${siteURL}/thumbnail/${image.type}/${encodeURIComponent(filename)}`
        return functions.util.appendURLParams(link, {hash: image.pixelHash})
    }

    public static getTagLink = (tag: Tag | TagCount | MiniTag) => {
        if (!tag.image) return ""
        let dest = "tag"
        if (tag.type === "artist") dest = "artist"
        if (tag.type === "character") dest = "character"
        if (tag.type === "series") dest = "series"
        if (tag.imageLink) return tag.imageLink
        if (tag.image.includes("history/")) return `${siteURL}/${tag.image}`
        const link = `${siteURL}/${dest}/${encodeURIComponent(tag.image)}`
        return tag.imageHash ? functions.util.appendURLParams(link, {hash: tag.imageHash}) : link
    }

    public static getFolderLink = (folder: string, filename: string | null, hash: string | null) => {
        if (!filename) return ""
        let dest = "tag"
        if (folder === "artist") dest = "artist"
        if (folder === "character") dest = "character"
        if (folder === "series") dest = "series"
        if (folder === "pfp") dest = "pfp"
        if (!folder || filename.includes("history/")) return `${siteURL}/${filename}`
        const link = `${siteURL}/${dest}/${encodeURIComponent(filename)}`
        return hash ? functions.util.appendURLParams(link, {hash: hash}) : link
    }
}