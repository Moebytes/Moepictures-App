/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Image, StyleProp, TextStyle} from "react-native"
import {useThemeSelector} from "../store"
import {createStylesheet} from "./styles/Link.styles"
import Link from "./Link"

interface Props {
    img?: string
    href: string
    children: React.ReactNode
    style?: StyleProp<TextStyle>
}

const FavivonLink: React.FunctionComponent<Props> = ({img, href, children, style}) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let favicon = img ?? 
        `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${href}&size=64`

    return (
        <View style={styles.container}>
            <Image style={styles.favicon} src={favicon}/>
            <Link style={style} href={href}>{children}</Link>
        </View>
    )
}

export default FavivonLink