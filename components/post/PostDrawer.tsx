/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Text, ScrollView} from "react-native"
import {LiquidGlassContainerView, LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useThemeSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "./styles/PostDrawer.styles"
import functions from "../../functions/Functions"
import {PostFull, TagCount} from "../../types/Types"

interface Props {
    post?: PostFull
    artists?: TagCount[] 
    characters?: TagCount[]  
    series?: TagCount[]
    meta?: TagCount[]
    tags?: TagCount[]
}

const PostDrawer: React.FunctionComponent<Props> = (props) => {
    const {session} = useSessionSelector()
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const insets = useSafeAreaInsets()
    const [dimensions, setDimensions] = useState({width: 0, height: 0, size: 0})

    useEffect(() => {
        const updateDimensions = async () => {
            if (!props.post) return
            const img = functions.link.getImageLink(props.post.images[0], session.upscaledImages)
            const dimensions = await functions.image.imageDimensions(img)
            setDimensions(dimensions)
        }
        updateDimensions()
    }, [props.post])

    const generateTagJSX = (tags?: TagCount[]) => {
        let jsx = [] as React.ReactElement[]
        if (!tags) return jsx

        for (const item of tags) {
            const getColor = () => {
                if (item.type === "artist") return colors.artistTagColorGlass
                if (item.type === "character") return colors.characterTagColorGlass
                if (item.type === "series") return colors.seriesTagColorGlass
                if (item.type === "meta") return colors.metaTagColorGlass
                if (item.type === "appearance") return colors.appearanceTagColorGlass
                if (item.type === "outfit") return colors.outfitTagColorGlass
                if (item.type === "accessory") return colors.accessoryTagColorGlass
                if (item.type === "action") return colors.actionTagColorGlass
                if (item.type === "scenery") return colors.sceneryTagColorGlass
                return colors.tagColor
            }

            jsx.push(
                <LiquidGlassView key={item.tag} interactive effect="clear" 
                    style={[styles.tag, {backgroundColor: getColor()}]}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                </LiquidGlassView>
            )
        }
        return jsx
    }

    const organizeTags = (tags?: TagCount[]) => {
        if (!tags?.length) return [] as TagCount[]
        const meta = tags.filter((t) => t.type === "meta")
        const appearance = tags.filter((t) => t.type === "appearance")
        const outfit = tags.filter((t) => t.type === "outfit")
        const accessory = tags.filter((t) => t.type === "accessory")
        const action = tags.filter((t) => t.type === "action")
        const scenery = tags.filter((t) => t.type === "scenery")
        const other = tags.filter((t) => t.type === "tag")
        return [...meta, ...appearance, ...outfit, ...accessory, ...action, ...scenery, ...other.reverse()]
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (!props.post) return null

    return (
        <LiquidGlassContainerView style={{flex: 1}}>
        <LiquidGlassView interactive effect="clear" style={[{flex: 1}, fallback, {paddingTop: insets.top + 10}]}>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.container, {paddingBottom: insets.bottom + 40}]}>
                <Text style={styles.title}>Post Info</Text>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Title:</Text>
                    <Text style={styles.text}>{props.post.title}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>English:</Text>
                    <Text style={styles.text}>{props.post.englishTitle}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Artist:</Text>
                    <Text style={styles.text}>{props.post.artist}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Posted:</Text>
                    <Text style={styles.text}>{functions.date.formatDate(new Date(props.post.posted))}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Bookmarks:</Text>
                    <Text style={styles.text}>{props.post.bookmarks}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Artist:</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.artists)}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Character:</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.characters)}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Series:</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(props.series)}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Tags:</Text>
                </View>
                <View style={styles.tagContainer}>
                    {generateTagJSX(organizeTags(props.tags))}
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Uploader:</Text>
                    <Text style={styles.text}>{functions.util.toProperCase(props.post.uploader)}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Uploaded:</Text>
                    <Text style={styles.text}>{functions.date.formatDate(new Date(props.post.uploadDate))}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Type:</Text>
                    <Text style={styles.text}>{props.post.type}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Rating:</Text>
                    <Text style={styles.text}>{props.post.rating}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Style:</Text>
                    <Text style={styles.text}>{props.post.style}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Favorites:</Text>
                    <Text style={styles.text}>{props.post.favoriteCount}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Cuteness:</Text>
                    <Text style={styles.text}>{props.post.cuteness}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Resolution:</Text>
                    <Text style={styles.text}>{dimensions.width}x{dimensions.height}</Text>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.highlightText}>Size:</Text>
                    <Text style={styles.text}>{functions.util.readableFileSize(dimensions.size)}</Text>
                </View>
            </ScrollView>
        </LiquidGlassView>
        </LiquidGlassContainerView>
    )
}

export default PostDrawer