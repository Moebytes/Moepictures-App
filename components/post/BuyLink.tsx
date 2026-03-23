/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/Commentary.styles"
import BuyLinkIcon from "../../assets/svg/buy-link.svg"
import {PostFull} from "../../types/Types"

interface Props {
    post?: PostFull
}

const BuyLink: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 22

    if (!props.post?.buyLink?.trim()) return null

    return (
        <View style={styles.container}>
            <View style={[styles.headerContainer, {gap: 7}]}>
                <Text style={styles.headerText}>{i18n.labels.buyLink}</Text>
                <View style={[styles.iconContainer, {marginTop: 2}]}>
                    <BuyLinkIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.post.buyLink}</Text>
            </View>
        </View>
    )
}

export default BuyLink