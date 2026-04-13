/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useMemo, useRef, useEffect, forwardRef, useImperativeHandle} from "react"
import {Canvas, Image, useImage, useCanvasRef, CanvasRef, ColorMatrix, RuntimeShader, Skia, Blur, Fit} from "@shopify/react-native-skia";
import {useFilterSelector} from "../../store"
import functions from "../../functions/Functions";

export interface ImageRef {
    toDataURL: () => string
}

interface Props {
    size?: {width: number, height: number}
    img?: string
    fit?: Fit
    onLoad?: () => void
}

const sharpenShader = `
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

const pixelateShader = `
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

const FilterImage = forwardRef<ImageRef, Props>((props, ref) => {
    const {brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate} = useFilterSelector()
    let {width, height} = props.size ?? {width: 1, height: 1}
    const canvasRef = useCanvasRef()

    useImperativeHandle(ref, () => ({
        toDataURL: () => {
            const img = canvasRef.current?.makeImageSnapshot()
            if (!img) return ""
            return img.encodeToBase64()
        }
    }))

    const image = useImage(props.img)
    const hasLoaded = useRef(false)

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

    return (
        <Canvas style={props.size} ref={canvasRef}>
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
})

export default FilterImage