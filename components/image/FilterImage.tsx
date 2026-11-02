/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {memo, useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle} from "react"
import {Canvas, Fill, Image, useCanvasRef, ColorMatrix, SkImage,
    RuntimeShader, Skia, Blur} from "@shopify/react-native-skia"
import {Platform, Image as RNImage} from "react-native"
import {useRoute} from "@react-navigation/native"
import {useFilterSelector, useThemeSelector} from "../../store"
import {Post, PostHistory} from "../../types/Types"
import functions from "../../functions/Functions"

export interface ImageRef {
    toDataURL: () => string
}

interface Props {
    size?: {width: number, height: number}
    img?: string
    fit?: "cover" | "contain"
    cache?: boolean
    onLoad?: () => void
    post?: Post | PostHistory
}

const sharpenShader = /*glsl*/`
    uniform shader image;
    uniform float strength;

    half4 main(float2 xy) {
        half4 c = image.eval(xy);

        half4 blur =
            image.eval(xy + float2(-1.0, -1.0)) * 0.0625 +
            image.eval(xy + float2( 0.0, -1.0)) * 0.125  +
            image.eval(xy + float2( 1.0, -1.0)) * 0.0625 +

            image.eval(xy + float2(-1.0,  0.0)) * 0.125  +
            image.eval(xy + float2( 1.0,  0.0)) * 0.125  +
                                              c * 0.25   +

            image.eval(xy + float2(-1.0,  1.0)) * 0.0625 +
            image.eval(xy + float2( 0.0,  1.0)) * 0.125  +
            image.eval(xy + float2( 1.0,  1.0)) * 0.0625;

        float s = clamp(strength, 0.0, 2.0);

        half3 detail = c.rgb - blur.rgb;
        half3 outColor = c.rgb + detail * s;

        return half4(clamp(outColor, 0.0, 1.0), c.a);
    }
`

const pixelateShader = /*glsl*/`
    uniform shader image;
    uniform float pixelSize;
    
    half4 main(float2 xy) {
        float2 pixelCoord = floor(xy / pixelSize) * pixelSize;
        half4 color = image.eval(pixelCoord + pixelSize / 2.0);
        return color;
    }
`

const sharpenEffect = Skia.RuntimeEffect.Make(sharpenShader)!
const pixelateEffect = Skia.RuntimeEffect.Make(pixelateShader)!

const images = new Map<string, {image: SkImage, bytes: number}>()
const pending = new Map<string, Promise<SkImage>>()
const maxBytes = 48 * 1024 * 1024
const maxEntries = 6
let bytes = 0

export const getCachedImage = (url: string) => {
    const cached = images.get(url)
    if (!cached) return null
    images.delete(url)
    images.set(url, cached)
    return cached.image
}

export const loadCachedImage = (url: string): Promise<SkImage> => {
    const cached = getCachedImage(url)
    if (cached) return Promise.resolve(cached)
    const request = pending.get(url)
    if (request) return request

    const loading = async () => {
        try {
            const buffer = await functions.http.fetch(url).then((r) => r.arrayBuffer())
            const image = Skia.Image.MakeImageFromEncoded(Skia.Data.fromBytes(new Uint8Array(buffer)))
            if (!image) throw new Error("Unable to decode")

            const size = image.width() * image.height() * 4
            while (images.size && (bytes + size > maxBytes || images.size >= maxEntries)) {
                const oldest = images.keys().next().value!
                bytes -= images.get(oldest)!.bytes
                images.delete(oldest)
            }
            
            if (size <= maxBytes) {
                images.set(url, {image, bytes: size})
                bytes += size
            }
            return image
        } finally {
            pending.delete(url)
        }
    }
    const promise = loading()
    pending.set(url, promise)
    return promise
}

const FilterImage = forwardRef<ImageRef, Props>((props, ref) => {
    const {colors} = useThemeSelector()
    const {brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate} = useFilterSelector()
    const [loadedImage, setLoadedImage] = useState<{url: string, image: SkImage} | null>(null)
    const filtersOn = functions.image.filtersOn({brightness, contrast, hue,
        saturation, lightness, blur, sharpen, pixelate})
    let {width, height} = props.size ?? {width: 1, height: 1}
    const canvasRef = useCanvasRef()
    const hasLoaded = useRef(false)
    const route = useRoute()
    
    const useSkia = Platform.OS === "ios" || filtersOn

    useImperativeHandle(ref, () => ({
        toDataURL: () => {
            const img = canvasRef.current?.makeImageSnapshot()
            if (!img) return ""
            return img.encodeToBase64()
        }
    }))

    useEffect(() => {
        let cancelled = false
        const loadImage = async () => {
            if (!props.img || !useSkia) return
            try {
                let image: SkImage | null
                if (props.cache) {
                    image = await loadCachedImage(props.img)
                } else {
                    const buffer = await functions.http.fetch(props.img).then((r) => r.arrayBuffer())
                    image = Skia.Image.MakeImageFromEncoded(Skia.Data.fromBytes(new Uint8Array(buffer)))
                }
                if (!cancelled && image) setLoadedImage({url: props.img, image})
            } catch {}
        }
        loadImage()
        return () => {
            cancelled = true
        }
    }, [props.img, props.cache, useSkia])

    const image = useMemo(() => {
        if (!props.img) return null
        if (props.cache) {
            const cached = getCachedImage(props.img)
            if (cached) return cached
        }
        if (!loadedImage || loadedImage.url !== props.img) return null
        return loadedImage.image
    }, [props.cache, props.img, loadedImage])

    useEffect(() => {
        hasLoaded.current = false
    }, [props.img])

    useEffect(() => {
        if (image && !hasLoaded.current) {
            hasLoaded.current = true
            props.onLoad?.()
        }
    }, [image, props.onLoad])

    const brightnessMatrix = useMemo(() => {
        const b = functions.util.remapRange(brightness, 0, 200, 0, 2)
        return [
            b, 0, 0, 0, 0,
            0, b, 0, 0, 0,
            0, 0, b, 0, 0,
            0, 0, 0, 1, 0
        ]
    }, [brightness])

    const contrastMatrix = useMemo(() => {
        const c = functions.util.remapRange(contrast, 0, 200, 0, 2)
        const t = 0.5 * (1 - c)

        return [
            c, 0, 0, 0, t,
            0, c, 0, 0, t,
            0, 0, c, 0, t,
            0, 0, 0, 1, 0
        ]
    }, [contrast])

    const hueMatrix = useMemo(() => {
        const angle = ((hue - 180) * Math.PI) / 180

        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        return [
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0, 0,

            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0, 0,

            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
            0, 0,

            0, 0, 0, 1, 0
        ]
    }, [hue])

    const saturationMatrix = useMemo(() => {
        const s = functions.util.remapRange(saturation, 0, 200, 0, 2)

        const r = 0.2126
        const g = 0.7152
        const b = 0.0722

        const a = (1 - s) * r
        const b1 = (1 - s) * g
        const c = (1 - s) * b

        return [
            a + s, b1, c, 0, 0,
            a, b1 + s, c, 0, 0,
            a, b1, c + s, 0, 0,
            0, 0, 0, 1, 0
        ]
    }, [saturation])

    const lightnessMatrix = useMemo(() => {
        const l = functions.util.remapRange(lightness, 0, 200, -1, 1)

        return [
            1, 0, 0, 0, l,
            0, 1, 0, 0, l,
            0, 0, 1, 0, l,
            0, 0, 0, 1, 0
        ]
    }, [lightness])

    let opaque = route.name === "Post" && Platform.OS === "android"

    if (useSkia) {
        return (
            <Canvas opaque={opaque} androidWarmup={opaque} style={props.size} ref={canvasRef}>
                {opaque && <Fill color={colors.background}/>}
                <Image image={image} x={0} y={0} width={width} height={height} fit={props.fit}>
                    <ColorMatrix matrix={brightnessMatrix}/>
                    <ColorMatrix matrix={contrastMatrix}/>
                    <ColorMatrix matrix={hueMatrix}/>
                    <ColorMatrix matrix={saturationMatrix}/>
                    <ColorMatrix matrix={lightnessMatrix}/>
                    <Blur blur={blur} mode="decal"/>
                    {sharpen > 0 && 
                    <RuntimeShader source={sharpenEffect} uniforms={{strength: sharpen}}/>}
                    {pixelate > 1 && 
                    <RuntimeShader source={pixelateEffect} uniforms={{pixelSize: pixelate}}/>}
                </Image>
            </Canvas>
        )
    }

    return (
        <RNImage source={{uri: props.img}} style={props.size} resizeMode={props.fit} onLoad={props.onLoad}/>
    )
})

export default memo(FilterImage)