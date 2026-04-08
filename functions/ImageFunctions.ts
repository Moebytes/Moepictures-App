/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Image, ImageSourcePropType} from "react-native"
import {PostSize} from "../types/ParamTypes"

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

    public static getImageSize = (sizeType: PostSize, square: boolean, tablet: boolean) => {
        if (tablet) {
            if (sizeType === "tiny") {
                return {imageSize: 240, columns: 5}
            } else if (sizeType === "small") {
                return {imageSize: 300, columns: 4}
            } else if (sizeType === "medium") {
                return {imageSize: 400, columns: 3}
            } else if (sizeType === "large") {
                return {imageSize: 600, columns: 2}
            } else {
                return {imageSize: 800, columns: 1}
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

    public static imageDimensions = async (image: string) => {
        return new Promise<{width: number, height: number, size: number}>(async (resolve) => {
            Image.getSize(image, async (width: number, height: number) => {
                try {
                    const r = await fetch(image).then((r) => r.blob())
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
}