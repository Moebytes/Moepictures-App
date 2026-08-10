/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import fileType from "magic-bytes.js"
import ReactNativeBlobUtil from "react-native-blob-util"
import {ImageChunk, Session, UploadImage} from "../types/Types"
import functions from "./Functions"
import {siteURL} from "../ui/site"

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
            const response = await functions.http.fetch(siteURL)
            const cookie = await functions.http.updateSessionCookie(response)

            for (const chunk of chunks) {
                const {bytes, ...metadata} = chunk

                const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${chunk.fileID}-${chunk.index}.bin`

                try {
                    const base64 = Buffer.from(bytes!).toString("base64")
                    await ReactNativeBlobUtil.fs.writeFile(path, base64, "base64")

                    let headers = {"Content-Type": "multipart/form-data", 
                        "x-csrf-token": session.csrfToken, "cookie": cookie}

                    await ReactNativeBlobUtil.fetch("POST", `${siteURL}/api/post/image-chunk`, 
                        headers, [
                            {name: "bytes", 
                            filename: "chunk.bin", 
                            type: "application/octet-stream", 
                            data: ReactNativeBlobUtil.wrap(path)},

                            {name: "metadata", data: JSON.stringify(metadata)}
                    ])

                } finally {
                    await ReactNativeBlobUtil.fs.unlink(path).catch(() => null)
                }
            }
        }
        await sendChunks(originalChunks)
        await sendChunks(upscaledChunks)
    }
}