/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import fileType from "magic-bytes.js"
import {ImageChunk, Session, UploadImage} from "../types/Types"
import functions from "./Functions"

export default class ByteFunctions {
    public static bufferFileType = (buffer: Uint8Array | ArrayBuffer | Buffer | number[]) => {
        buffer = Buffer.from(new Uint8Array(buffer))

        const majorBrand = buffer.toString("utf8", 8, 12)
        if (majorBrand === "avif" || majorBrand === "avis") {
            return [{typename: "avif", mime: "image/avif", extension: "avif"}]
        }
        return fileType(new Uint8Array(buffer))
    }

    public static fetchDataURL = async (url: string) => {
        const blob = await fetch(url).then((r) => r.blob())
        return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
        })
    }

    public static arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
        let mime = this.bufferFileType(Buffer.from(arrayBuffer))[0]?.mime || "image/png"
        return `data:${mime};base64,${Buffer.from(arrayBuffer).toString("base64")}`
    }

    public static chunkImages = (images: UploadImage[], upscaledImages: UploadImage[]) => {
        const chunkSize = 50 * 1024 * 1024

        const chunkBytes = (images: UploadImage[]) => {
            let chunks = [] as ImageChunk[]

            for (let i = 0; i < images.length; i++) {
                let fileID = Math.random().toString(36).slice(2) + Date.now().toString(36)
                let img = images[i]
                let bytes = img.bytes

                for (let start = 0, i = 0; start < bytes.length; start += chunkSize, i++) {
                    let chunk = {...img} as ImageChunk
                    chunk.fileID = fileID
                    chunk.index = i + 1
                    chunk.bytes = bytes.slice(start, start + chunkSize)
                    chunks.push(chunk)
                }
            }

            return chunks
        }

        let imageChunks = chunkBytes(images)
        let upscaledChunks = chunkBytes(upscaledImages)

        return {imageChunks, upscaledChunks}
    }

    public static uploadChunks = async (originalChunks: ImageChunk[], upscaledChunks: ImageChunk[], 
        session: Session) => {
        const sendChunks = async (chunks: ImageChunk[]) => {
            for (const chunk of chunks) {
                const form = new FormData()
                form.append("bytes", new Blob([new Uint8Array(chunk.bytes!)]))
                delete chunk.bytes
                form.append("metadata", JSON.stringify({...chunk}))
                await functions.http.postForm("/api/post/image-chunk", form, session)
            }
        }
        await sendChunks(originalChunks)
        await sendChunks(upscaledChunks)
    }
}