/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import crypto from "crypto"
import functions from "./Functions"
import decryption from "../structures/Decryption"
import {PostHistory, PostSearch, NoteHistory, GroupHistory, TagHistory, Session} from "../types/Types"

export default class CompareFunctions {
    public static imagesChanged = async (revertPost: PostSearch | PostHistory, currentPost: PostSearch | PostHistory, session: Session) => {
        let privateKey = await functions.http.updateClientKeys(session)
        let serverPublicKey = await functions.http.updateServerKey(session)

        if (revertPost.images.length !== currentPost.images.length) return true
        for (let i = 0; i < revertPost.images.length; i++) {
            const revImage = revertPost.images[i]
            const currImage = currentPost.images[i]
            const revUpscaledImage = revertPost.upscaledImages?.[i] || revImage
            const currUpscaledImage = currentPost.upscaledImages?.[i] || currImage
            
            let imgLink = typeof revImage === "string" ? await functions.link.getPostImage(revertPost, i, session, false) : functions.link.getImageLink(revImage)
            let currentLink = typeof currImage === "string" ? await functions.link.getPostImage(currentPost, i, session, false) : functions.link.getImageLink(currImage)

            let upscaledImgLink = typeof revUpscaledImage === "string" ? await functions.link.getPostImage(revertPost, i, session, true) : functions.link.getImageLink(revUpscaledImage, true)
            let currentUpscaledLink = typeof currUpscaledImage === "string" ? await functions.link.getPostImage(currentPost, i, session, true) : functions.link.getImageLink(currUpscaledImage, true)

            let imgBuffer = await functions.http.getBuffer(functions.util.appendURLParams(imgLink, {upscaled: false}), {"x-force-upscale": "false"})
            let currentBuffer = await functions.http.getBuffer(functions.util.appendURLParams(currentLink, {upscaled: false}), {"x-force-upscale": "false"})
            let upscaledImgBuffer = await functions.http.getBuffer(functions.util.appendURLParams(upscaledImgLink, {upscaled: true}), {"x-force-upscale": "true"})
            let upscaledCurrentBuffer = await functions.http.getBuffer(functions.util.appendURLParams(currentUpscaledLink, {upscaled: true}), {"x-force-upscale": "true"})

            if (imgBuffer.byteLength && functions.file.isImage(imgLink)) {
                let isAnimated = functions.file.isAnimatedWebp(imgBuffer)
                if (!isAnimated) isAnimated = functions.file.isAnimatedPng(imgBuffer)
                if (!isAnimated) imgBuffer = decryption.decrypt(imgBuffer, privateKey, serverPublicKey, session).buffer
            }
            if (currentBuffer.byteLength && functions.file.isImage(currentLink)) {
                let isAnimated = functions.file.isAnimatedWebp(currentBuffer)
                if (!isAnimated) isAnimated = functions.file.isAnimatedPng(currentBuffer)
                if (!isAnimated) currentBuffer = decryption.decrypt(currentBuffer, privateKey, serverPublicKey, session).buffer
            }
            if (upscaledImgBuffer.byteLength && functions.file.isImage(upscaledImgLink)) {
                let isAnimated = functions.file.isAnimatedWebp(upscaledImgBuffer)
                if (!isAnimated) isAnimated = functions.file.isAnimatedPng(upscaledImgBuffer)
                if (!isAnimated) upscaledImgBuffer = decryption.decrypt(upscaledImgBuffer, privateKey, serverPublicKey, session).buffer
            }
            if (upscaledCurrentBuffer.byteLength && functions.file.isImage(currentUpscaledLink)) {
                let isAnimated = functions.file.isAnimatedWebp(upscaledCurrentBuffer)
                if (!isAnimated) isAnimated = functions.file.isAnimatedPng(upscaledCurrentBuffer)
                if (!isAnimated) upscaledCurrentBuffer = decryption.decrypt(upscaledCurrentBuffer, privateKey, serverPublicKey, session).buffer
            }

            if (imgBuffer.byteLength) {
                const imgMD5 = crypto.createHash("md5").update(Buffer.from(imgBuffer) as any).digest("hex")
                const currentMD5 = crypto.createHash("md5").update(Buffer.from(currentBuffer) as any).digest("hex")
                if (imgMD5 !== currentMD5) return true
            }
            if (upscaledImgBuffer.byteLength) {
                const imgMD5 = crypto.createHash("md5").update(Buffer.from(upscaledImgBuffer) as any).digest("hex")
                const currentMD5 = crypto.createHash("md5").update(Buffer.from(upscaledCurrentBuffer) as any).digest("hex")
                if (imgMD5 !== currentMD5) return true
            }
        }
        return false
    }

    public static tagsChanged = (revertPost: PostSearch | PostHistory, currentPost: PostSearch | PostHistory) => {
        if (JSON.stringify(revertPost.artists) !== JSON.stringify(currentPost.artists)) return true
        if (JSON.stringify(revertPost.characters) !== JSON.stringify(currentPost.characters)) return true
        if (JSON.stringify(revertPost.series) !== JSON.stringify(currentPost.series)) return true
        if (JSON.stringify(revertPost.tags) !== JSON.stringify(currentPost.tags)) return true
        return false
    }

    public static sourceChanged = (revertPost: PostSearch | PostHistory, currentPost: PostSearch | PostHistory) => {
        if (revertPost.title !== currentPost.title) return true
        if (revertPost.englishTitle !== currentPost.englishTitle) return true
        if (revertPost.posted !== currentPost.posted) return true
        if (revertPost.source !== currentPost.source) return true
        if (revertPost.artist !== currentPost.artist) return true
        if (revertPost.commentary !== currentPost.commentary) return true
        if (revertPost.englishCommentary !== currentPost.englishCommentary) return true
        return false
    }

    public static hasHistoryChanges = (history: PostHistory | NoteHistory | GroupHistory | TagHistory) => {
        if ("addedTags" in history) {
            let changes = history.changes && Boolean(Object.keys(history.changes).length)
            let tagChanges = Boolean(history.addedTags?.length) || Boolean(history.removedTags?.length)
            let tagGroupChanges = Boolean(history.addedTagGroups?.length) || Boolean(history.removedTagGroups?.length)
            return changes || tagChanges || tagGroupChanges
        }
        if ("addedEntries" in history) {
            let noData = history.notes.length === 1 && history.notes[0]?.transcript?.trim().toLowerCase() === "no data"
            const hasNotes = history.notes.length > 1 || !noData
            let noteChanges = Boolean(history.addedEntries?.length) || Boolean(history.removedEntries?.length)
            return hasNotes || noteChanges
        }
        if ("addedPosts" in history) {
            let changes = history.changes && Boolean(Object.keys(history.changes).length)
            let postChanges = Boolean(history.addedPosts?.length) || Boolean(history.addedPosts?.length)
            return changes || postChanges
        }
        return history.changes && Boolean(Object.keys(history.changes).length)
    }
}