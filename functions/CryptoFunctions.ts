/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import permissions from "../structures/Permissions"
import decryption from "../structures/Decryption"
import {Session} from "../types/Types"
import path from "path"

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

    public static decryptItem = async (img: string, session: Session, cacheKey?: string) => {
        if (permissions.noEncryption(session)) return img
        let privateKey = await functions.http.updateClientKeys(session)
        let serverPublicKey = await functions.http.updateServerKey(session)

        if (!cacheKey) cacheKey = img
        const cached = functions.cache.getImageCache(cacheKey)
        if (cached) return cached
        if (functions.file.isVideo(img)) {
            return img
        }
        let isAnimatedWebP = false
        let isAnimatedPNG = false
        let arrayBuffer = null as ArrayBuffer | null
        let decrypted = await decryption.decryptedLink(img, privateKey, serverPublicKey, session)
        if (functions.file.isWebP(img)) {
            arrayBuffer = await functions.http.getBuffer(img)
            isAnimatedWebP = functions.file.isAnimatedWebp(arrayBuffer)
        }
        if (functions.file.isPNG(img)) {
            arrayBuffer = await functions.http.getBuffer(img)
            isAnimatedPNG = functions.file.isAnimatedPng(arrayBuffer)
        }
        if (functions.file.isImage(img) && !isAnimatedWebP && !isAnimatedPNG) {
            const base64 = await functions.link.linkToBase64(decrypted)
            functions.cache.cachedImages.set(cacheKey, base64)
            return base64
        } else {
            arrayBuffer = await functions.http.getBuffer(decrypted)
            const url = functions.byte.arrayBufferToBase64(arrayBuffer)
            functions.cache.cachedImages.set(cacheKey, url)
            return url
        }
    }

    public static decryptBuffer = async (buffer: ArrayBuffer, imageLink: string, session: Session) => {
        if (permissions.noEncryption(session)) return buffer
        let privateKey = await functions.http.updateClientKeys(session)
        let serverPublicKey = await functions.http.updateServerKey(session)

        if (functions.file.isVideo(imageLink)) {
            return buffer
        }
        let decrypted = decryption.decrypt(buffer, privateKey, serverPublicKey, session)
        return decrypted
    }
}