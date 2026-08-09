/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState} from "react"
import {View, Text} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {LiquidGlassView} from "@callstack/liquid-glass"
import {useThemeSelector} from "../../store"
import {useGetFavoriteTagsQuery} from "../../api"
import {createStylesheet} from "./styles/FavoriteTags.styles"
import HeartIcon from "../../assets/svg/heart.svg"
import ScalableHaptic from "../../ui/ScalableHaptic"
import PressableHaptic from "../../ui/PressableHaptic"
import functions from "../../functions/Functions"

interface Props {
    username: string
}

const FavoriteTags: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const {data: tags} = useGetFavoriteTagsQuery(
        {username: props.username}
    )

    let iconSize = 20

    const generateFavoriteTagsJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!tags?.length) return jsx

        for (const tag of tags) {
            jsx.push(
                <PressableHaptic key={tag.tag} onPress={() => navigation.navigate("Tag", {name: tag.tag}, {pop: true})}>
                    <LiquidGlassView interactive effect="clear" 
                        style={[styles.tag]}>
                            <HeartIcon width={iconSize} height={iconSize} color={colors.white}/>
                            <Text style={styles.tagText}>{tag.tag.replace(/-/g, " ")}</Text>
                    </LiquidGlassView>
                </PressableHaptic>
            )
        }

        return jsx
    }

    const totalItems = tags?.length ?? 0
    if (!tags?.length) return null

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{i18n.user.favoriteTags}</Text>
                </View>
                <Text style={styles.labelText}>{totalItems}</Text>
            </View>
            <View style={styles.rowContainer}>
                {generateFavoriteTagsJSX()}
            </View>
        </View>
    )
}

export default FavoriteTags