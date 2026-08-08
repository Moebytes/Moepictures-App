/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Image, ImageSourcePropType} from "react-native"
import {PostSize} from "../types/ParamTypes"
import ImageResizer from "@bam.tech/react-native-image-resizer"
import functions from "./Functions"

export default class ImageFunctions {
    public static dynamicResize = async (img: ImageSourcePropType, maxSize: number, deviceWidth: number) => {
        const asset = Image.resolveAssetSource(img)
        const size = await Image.getSize(asset.uri)

        let newWidth = 0
        let newHeight = 0

        if (size.width > size.height) {
            const ratio = size.height / size.width
            newWidth = maxSize
            newHeight = maxSize * ratio
        } else {
            const ratio = size.width / size.height
            newHeight = maxSize
            newWidth = maxSize * ratio
        }

        if (newWidth > deviceWidth) {
            const scale = deviceWidth / newWidth
            newWidth = deviceWidth
            newHeight = newHeight * scale
        }

        return {width: newWidth, height: newHeight}
    }

    public static normalizeHeight = async (img: ImageSourcePropType, height: number, deviceWidth: number) => {
        const asset = Image.resolveAssetSource(img)
        const size = await Image.getSize(asset.uri)

        const scale = height / size.height

        let newHeight = height
        let newWidth = size.width * scale

        if (newWidth > deviceWidth) {
            const scale = deviceWidth / newWidth
            newWidth = deviceWidth
            newHeight = newHeight * scale
        }

        return {width: newWidth, height: newHeight}
    }

    public static normalizeWidth = async (img: ImageSourcePropType, width: number, deviceWidth: number) => {
        const asset = Image.resolveAssetSource(img)
        const size = await Image.getSize(asset.uri)

        const scale = width / size.width

        let newWidth = width
        if (newWidth > deviceWidth) {
            newWidth = deviceWidth
        }
        
        let newHeight = size.height * scale

        return {width: newWidth, height: newHeight}
    }

    public static getImageSize = (sizeType: PostSize, square: boolean, tablet: boolean, width: number) => {
        let portrait = width <= 1000
        if (tablet) {
            if (sizeType === "tiny") {
                return {imageSize: portrait ? 150 : 240, columns: 5}
            } else if (sizeType === "small") {
                return {imageSize: portrait ? 200 : 300, columns: 4}
            } else if (sizeType === "medium") {
                return {imageSize: portrait ? 270 : 400, columns: 3}
            } else if (sizeType === "large") {
                return {imageSize: portrait ? 400 : 600, columns: 2}
            } else {
                return {imageSize: portrait ? 700 : 800, columns: 1}
            }
        } else {
            if (sizeType === "tiny") {
                return {imageSize: square ? 100 : 120, columns: 4}
            } else if (sizeType === "small") {
                return {imageSize: square ? 135 : 160, columns: 3}
            } else if (sizeType === "medium") {
                return {imageSize: 200, columns: 2}
            } else if (sizeType === "large") {
                return {imageSize: square ? 200 : 250, columns: 2}
            } else {
                return {imageSize: 350, columns: 1}
            }
        }
    }

    public static dimensions = async (link: string) => {
        let dimensions = await this.imageDimensions(link)
        return {...dimensions, duration: 0}
    }

    public static thumbnail = async (link: string) => {
        let thumbnail = ""
        let thumbnailExt = "png"
        const bytes = await functions.http.getBuffer(link)
        const result = functions.byte.bufferFileType(bytes)?.[0] || {}
        thumbnailExt = result.typename || "jpg"
        thumbnail = link
        thumbnail = await functions.image.resize(thumbnail, thumbnailExt)
        return {thumbnail, thumbnailExt}
    }

    public static resize = async (image: string, ext = "png", size = 750) => {
        const dimensions = await Image.getSize(image)
        const scale = Math.min(size / dimensions.width, size / dimensions.height)

        const width = Math.round(dimensions.width * scale)
        const height = Math.round(dimensions.height * scale)

        const uri = await functions.file.saveRemoteImage(image)
        const resized = await functions.file.resizeLocalImage(uri, width, height)
        const bytes = await functions.file.readBytes(resized)
        const base64 = functions.byte.arrayBufferToBase64(bytes.buffer)

        functions.file.deleteLocation(resized)

        return base64
    }

    public static imageDimensions = async (image: string) => {
        return new Promise<{width: number, height: number, size: number}>(async (resolve) => {
            Image.getSize(image, async (width: number, height: number) => {
                try {
                    const r = await functions.http.fetch(image).then((r) => r.blob())
                    const size = r.size
                    resolve({width, height, size})
                } catch {
                    resolve({width, height, size: 0})
                }
            }, () => {
                resolve({width: 0, height: 0, size: 0})
            })
        })
    }
    

    public static filtersOn = (filters: {brightness: number, contrast: number, hue: number, saturation: number,
        lightness: number, blur: number, sharpen: number, pixelate: number}) => {
        let {brightness, contrast, hue, saturation, lightness, blur, sharpen, pixelate} = filters
        if ((brightness !== 100) ||
            (contrast !== 100) ||
            (hue !== 180) ||
            (saturation !== 100) ||
            (lightness !== 100) ||
            (blur !== 0) ||
            (sharpen !== 0) ||
            (pixelate !== 1)) {
                return true 
            } else {
                return false
            }
    }
}