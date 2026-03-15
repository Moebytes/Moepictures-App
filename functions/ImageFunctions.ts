/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Image, ImageSourcePropType, useWindowDimensions} from "react-native"

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
}