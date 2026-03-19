/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Pressable} from "react-native"
import IconButton from "../../ui/IconButton"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/PostImageOptions.styles"
import StarIcon from "../../assets/svg/star.svg"
import StarGroupIcon from "../../assets/svg/stargroup.svg"
import InfoIcon from "../../assets/svg/info.svg"
import DownloadIcon from "../../assets/svg/download.svg"
import FiltersIcon from "../../assets/svg/filters.svg"
import functions from "../../functions/Functions"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
    openDrawer?: () => void
}

const PostImageOptions: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const styles = createStylesheet(colors)

    const downloadImage = () => {
        if (!props.post) return
        const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
    }

    let iconSize = 35

    return (
        <View style={styles.container}>
            <IconButton icon={StarIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={() => null}>
                <Text style={styles.text}>{i18n.post.favorite}</Text>
            </IconButton>
            <IconButton icon={StarGroupIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={() => null}>
                <Text style={styles.text}>{i18n.post.favgroup}</Text>
            </IconButton>
            <IconButton icon={InfoIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={props.openDrawer}>
                    <Text style={styles.text}>{i18n.post.info}</Text>
            </IconButton>
            <IconButton icon={DownloadIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={downloadImage}>
                <Text style={styles.text}>{i18n.buttons.download}</Text>
            </IconButton>
            <IconButton icon={FiltersIcon} size={iconSize} color={colors.iconColor} 
                activeColor={colors.iconActive} style={styles.iconContainer} onPress={() => null}>
                <Text style={styles.text}>{i18n.filters.filters}</Text>
            </IconButton>
        </View>
    )
}

export default PostImageOptions