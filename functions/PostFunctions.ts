/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {PostSearch, PostRating, PostHistory, PostStyle, Post, UploadImage, UploadTag, Session} from "../types/Types"
import {ThemeColors} from "../ui/colors"
import path from "path"
import functions from "./Functions"

export default class PostFunctions {
    public static borderColor = (post: PostSearch, colors: ThemeColors) => {
        if (post.favorited) return colors.favoriteBorder
        if (post.favgrouped) return colors.favgroupBorder
        if (post.hidden) return colors.takendownBorder
        if (post.locked) return colors.lockedBorder
        if (post.hasChildren) return colors.parentBorder
        if (post.parentID) return colors.childBorder
        if (post.isGrouped) return colors.groupBorder
        if (Number(post.variationCount) > 1) return colors.variationBorder
        return colors.borderColor
    }

    public static isR18 = (ratingType: PostRating) => {
        return ratingType === "lewd" || ratingType === "all+l"
    }

    public static isSketch = (styleType: PostStyle) => {
        return styleType === "sketch" || styleType === "lineart"
    }

    public static appendIfNotExists = (post: Post | PostHistory, posts: Post[]) => {
        const index = posts.findIndex((p) => p.postID === post.postID)

        if (index === -1) {
            return [post, ...posts] as Post[]
        } else {
            return posts as Post[]
        }
    }

    public static generateSlug = (name: string) => {
        let slug = String(name).trim().toLowerCase().replace(/\s+/g, "-").replace(/\//g, "").replace(/\\\\/g, "")
        slug = slug.replace(/#/g, "")
        slug = slug.replace(/\?/g, "")
        slug = slug.replace(/&/g, "")
        if (!slug) slug = "untitled"
        return slug
    }

    public static parseImages = async (post: PostSearch | PostHistory, session: Session) => {
        let images = [] as UploadImage[]
        let upscaledImages = [] as UploadImage[]
        for (let i = 0; i < post.images.length; i++) {
            const image = post.images[i]
            const upscaledImage = post.upscaledImages?.[i] || image

            let imgLink = typeof image === "string" ? await functions.link.getPostImage(post, i, session, false) : functions.link.getImageLink(image)
            let upscaledImgLink = typeof upscaledImage === "string" ? await functions.link.getPostImage(post, i, session, true) : functions.link.getImageLink(upscaledImage, true)
            let altSource = typeof image === "string" ? "" : image.altSource
            let directLink = typeof image === "string" ? "" : image.directLink

            let buffer = await functions.http.getBuffer(functions.util.appendURLParams(imgLink, {upscaled: false}), {"x-force-upscale": "false"})
            let upscaledBuffer = await functions.http.getBuffer(functions.util.appendURLParams(upscaledImgLink, {upscaled: true}), {"x-force-upscale": "true"})

            if (buffer.byteLength) {
                let ext = path.extname(imgLink)
                let link = await functions.crypto.decryptItem(imgLink, session)
                if (!link.includes(ext)) link += `#${ext}`
                let decrypted = await functions.crypto.decryptBuffer(buffer, imgLink, session)

                let {width, height, size, duration} = await functions.image.dimensions(link)
                let {thumbnail, thumbnailExt} = await functions.image.thumbnail(link)

                images.push({link, ext: ext.replace(".", ""), width, height, size, duration, thumbnail, thumbnailExt, altSource,
                directLink, originalLink: imgLink, bytes: Object.values(new Uint8Array(decrypted)), name: path.basename(imgLink)})
            }
            if (upscaledBuffer.byteLength) {
                let upscaledExt = path.extname(upscaledImgLink)
                let upscaledLink = await functions.crypto.decryptItem(upscaledImgLink, session)
                if (!upscaledLink.includes(upscaledExt)) upscaledLink += `#${upscaledExt}`
                let decrypted = await functions.crypto.decryptBuffer(upscaledBuffer, upscaledImgLink, session)
                
                let {width, height, size, duration} = await functions.image.dimensions(upscaledLink)
                let {thumbnail, thumbnailExt} = await functions.image.thumbnail(upscaledLink)
                
                upscaledImages.push({link: upscaledLink, ext: upscaledExt.replace(".", ""), width, height, 
                size, duration, thumbnail, thumbnailExt, originalLink: upscaledImgLink, altSource, directLink,
                bytes: Object.values(new Uint8Array(decrypted)), name: path.basename(upscaledImgLink)})
            }
        }
        
        return {images, upscaledImages}
    }

    public static parseNewTags = async (post: PostSearch | PostHistory, session: Session) => {
        const tags = post.tags
        if (!tags?.[0]) return []
        const tagMap = await functions.cache.tagCountsCache(session)
        let notExists = [] as UploadTag[]
        for (let i = 0; i < tags.length; i++) {
            const exists = tagMap[tags[i]]
            if (!exists) notExists.push({tag: tags[i], description: `${functions.util.toProperCase(tags[i]).replace(/-/g, " ")}.`})
        }
        return notExists
    }

    public static imageSourceMap = (post: Post | PostHistory) => {
            const sourceMap = {} as {[key: string]: string | null}
            if ("historyID" in post) {
                if (post.imageSources) {
                    for (const entry of Object.entries(post.imageSources)) {
                        let [key, value] = entry
                        if (value?.trim()) {
                            sourceMap[String(key)] = value.trim()
                        }
                    }
                }
            } else {
                for (const image of post.images) {
                    if (image.altSource?.trim()) {
                        sourceMap[String(image.order)] = image.altSource.trim()
                    }
                }
            }
            return sourceMap
        }

        public static imageLinkMap = (post: Post | PostHistory) => {
            const linkMap = {} as {[key: string]: string | null}
            if ("historyID" in post) {
                if (post.imageLinks) {
                    for (const entry of Object.entries(post.imageLinks)) {
                        let [key, value] = entry
                        if (value?.trim()) {
                            linkMap[String(key)] = value.trim()
                        }
                    }
                }
            } else {
                for (const image of post.images) {
                    if (image.directLink?.trim()) {
                        linkMap[String(image.order)] = image.directLink.trim()
                    }
                }
            }
            return linkMap
        }
}