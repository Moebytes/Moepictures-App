/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import {Linking} from "react-native"
import {Session, Image, Tag, TagCount, MiniTag, Post, PostHistory} from "../types/Types"
import {siteURL} from "../ui/site"
import path from "path"

export default class LinkFunctions {
    private static postImageCache: Map<string, string> = new Map()
    private static postThumbnailCache: Map<string, string> = new Map()

    public static getImageLink = (image: Image, upscaled?: boolean) => {
        if (!image.filename && !image.upscaledFilename) return ""
        let filename = upscaled ? image.upscaledFilename || image.filename : image.filename
        if (upscaled && image.upscaledImageLink) return image.upscaledImageLink
        if (image.imageLink) return image.imageLink
        const link = `${siteURL}/${image.type}/${image.postID}-${image.order}-${encodeURIComponent(filename)}`
        return functions.util.appendURLParams(link, {hash: image.pixelHash})
    }

    public static getThumbnailLink = (image: Image, sizeType: string, session: Session, forceLive?: boolean) => {
        if (!image.thumbnail && !image.filename) return ""
        let originalFilename = `${image.postID}-${image.order}-${encodeURIComponent(image.filename)}`
        let filename = image.thumbnail || originalFilename
        if (forceLive) return this.getImageLink(image, false)
        if (image.type === "image" || image.type === "comic") {
            if (sizeType === "massive") {
                return this.getImageLink(image, false)
            }
        }
        if (image.type === "animation" || image.type === "video") {
            if (session.liveAnimationPreview && !functions.file.isZip(originalFilename)) return this.getImageLink(image, false)
        }
        if (image.type === "model" || image.type === "live2d") {
            if (session.liveModelPreview) return this.getImageLink(image, false)
        }
        if (image.thumbLink) return image.thumbLink
        const link = `${siteURL}/thumbnail/${image.type}/${encodeURIComponent(filename)}`
        return functions.util.appendURLParams(link, {hash: image.pixelHash})
    }

    public static getPostThumbnail = async (partialPost: Post | PostHistory, index: number, sizeType: string, 
        session: Session) => {
        const cacheKey = `${partialPost.postID}:${index}:${sizeType}`

        if (this.postThumbnailCache.has(cacheKey)) {
            return this.postThumbnailCache.get(cacheKey)!
        }

        let image = partialPost.images[index]

        if (typeof image === "string") {
            if (image.startsWith("history/post")) return `${siteURL}/${image}`
            if (new URL(image).searchParams.has("hash")) return image
        }
        let post = await functions.http.get("/api/post", {postID: partialPost.postID}, session)
        if (!post) return ""
        const thumb = this.getThumbnailLink(post.images[index], sizeType, session)

        this.postThumbnailCache.set(cacheKey, thumb)
        return thumb
    }

    public static getTagLink = (tag: Tag | TagCount | MiniTag) => {
        if (!tag?.image) return ""
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

    public static openSocialLink = async (link: string | null) => {
        let appURL = ""
        let webURL = link ?? ""

        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        } else if (webURL.includes("twitter.com") || webURL.includes("x.com")) {
            const userMatch = webURL.match(/twitter\.com\/([a-zA-Z0-9_]+)/) 
                || webURL.match(/x\.com\/([a-zA-Z0-9_]+)/)
            if (userMatch?.[1]) {
                const username = userMatch[1]
                appURL = `twitter://user?screen_name=${username}`
            }
        }

        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    public static openSourceLink = async (link?: string | null) => {
        let appURL = ""
        let webURL = link ?? ""

        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        } else if (webURL.includes("twitter.com") || webURL.includes("x.com")) {
            const tweetMatch = webURL.match(/status\/(\d+)/)
            if (tweetMatch?.[1]) {
                const tweetID = tweetMatch[1]
                appURL = `twitter://status?id=${tweetID}`
            }
        }
        
        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    public static getPostImage = async (partialPost: Post | PostHistory, index: number, 
        session: Session, upscaled?: boolean) => {
        const cacheKey = `${partialPost.postID}:${index}`

        if (this.postImageCache.has(cacheKey)) {
            return this.postImageCache.get(cacheKey)!
        }

        let image = partialPost.images[index]
        if (upscaled && partialPost.upscaledImages?.length) image = partialPost.upscaledImages[index]

        if (typeof image === "string") {
            if (image.startsWith("history/post")) return `${siteURL}/${image}`
            if (new URL(image).searchParams.has("hash")) return image
        }
        let post = await functions.http.get("/api/post", {postID: partialPost.postID}, session)
        if (!post) return ""
        const img = this.getImageLink(post.images[index], upscaled)

        this.postImageCache.set(cacheKey, img)
        return img
    }

    public static resolveImage = async (image: Image | string, session: Session, upscaled?: boolean) => {
        if (typeof image === "string") {
            if (image.startsWith("history/post")) return `${siteURL}/${image}`
            if (new URL(image).searchParams.has("hash")) return image
            const [postID, order, filename] = path.basename(image).split("-")

            let post = await functions.http.get("/api/post", {postID}, session)
            if (!post) return ""
            
            let img = post.images[Number(order) - 1]
            return this.getImageLink(img, upscaled)
        } else {
            return this.getImageLink(image, upscaled)
        }
    }

    public static resolveThumbnail = async (image: Image | string, sizeType: string, session: Session) => {
        if (typeof image === "string") {
            if (image.startsWith("history/post")) return `${siteURL}/${image}`
            if (new URL(image).searchParams.has("hash")) return image
            const [postID, order, filename] = path.basename(image).split("-")

            let post = await functions.http.get("/api/post", {postID}, session)
            if (!post) return ""

            let img = post.images[Number(order) - 1]
            return this.getThumbnailLink(img, sizeType, session)
        } else {
            return this.getThumbnailLink(image, sizeType, session)
        }
    }

    public static linkToBase64 = async (link: string) => {
        const arrayBuffer = await functions.http.getBuffer(link)
        if (!arrayBuffer.byteLength) return ""
        const buffer = Buffer.from(arrayBuffer)
        let mime = functions.byte.bufferFileType(arrayBuffer)[0]?.mime || "image/jpeg"
        return `data:${mime};base64,${buffer.toString("base64")}`
    }
}