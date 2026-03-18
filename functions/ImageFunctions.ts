/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Image, ImageSourcePropType} from "react-native"

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