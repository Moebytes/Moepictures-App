/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, ScrollView} from "react-native"
import {LiquidGlassContainerView, LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PostDrawer.styles"

const PostDrawer: React.FunctionComponent = () => {
  const {theme, colors} = useThemeSelector()
  const styles = createStylesheet(colors)
  const insets = useSafeAreaInsets()

  const data1 = [{tag: "mozukun43", type: "artist"}]
  const data2 = [{tag: "chino-kafuu-(is-the-order-a-rabbit)", type: "character"}]
  const data3 = [{tag: "is-the-order-a-rabbit?", type: "series"}]
  const data4 = [
    {tag: "autotags", type: "meta"},
    {tag: "upscaled", type: "meta"},
    {tag: "photoshop", type: "meta"},
    {tag: "solo", type: "appearance"},
    {tag: "long-hair", type: "appearance"},
    {tag: "blush", type: "appearance"},
    {tag: "smile", type: "appearance"},
    {tag: "open-mouth", type: "appearance"},
    {tag: "blue-hair", type: "appearance"},
    {tag: "closed-eyes", type: "appearance"},
    {tag: "skirt", type: "outfit"},
    {tag: "school-uniform", type: "outfit"},
    {tag: "pleated-skirt", type: "outfit"},
    {tag: "hoto-cocoas-school-uniform", type: "outfit"},
    {tag: "hair-ornament", type: "accessory"},
    {tag: "food", type: "accessory"},
    {tag: "bag", type: "accessory"},
    {tag: "fruit", type: "accessory"},
    {tag: "shoulder-bag", type: "accessory"},
    {tag: "strawberry", type: "accessory"},
    {tag: "crepe", type: "accessory"},
    {tag: "interlocked-fingers", type: "action"},
    {tag: "outdoors", type: "scenery"},
    {tag: "day", type: "scenery"},
    {tag: "road", type: "scenery"},
    {tag: "street", type: "scenery"}
]

  const generateTagJSX = (data: {tag: string, type: string}[]) => {
    let jsx = [] as React.ReactElement[]

    for (const item of data) {
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

  const fallback = !isLiquidGlassSupported
    ? {backgroundColor: "rgba(255,255,255,0.2)"}
    : undefined

  return (
    <LiquidGlassContainerView style={{flex: 1}}>
      <LiquidGlassView interactive effect="clear" style={[{flex: 1}, fallback, {paddingTop: insets.top + 10}]}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, {paddingBottom: insets.bottom + 40}]}>
            <Text style={styles.title}>Post Info</Text>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Title:</Text>
                <Text style={styles.text}>しょうがないココアさんです</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>English:</Text>
                <Text style={styles.text}>It's A Cocoa Who Can't Help</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Artist:</Text>
                <Text style={styles.text}>もくず</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Posted:</Text>
                <Text style={styles.text}>10-31-2020</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Bookmarks:</Text>
                <Text style={styles.text}>7628</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Artist:</Text>
            </View>
            <View style={styles.tagContainer}>
                {generateTagJSX(data1)}
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Character:</Text>
            </View>
            <View style={styles.tagContainer}>
                {generateTagJSX(data2)}
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Series:</Text>
            </View>
            <View style={styles.tagContainer}>
                {generateTagJSX(data3)}
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Tags:</Text>
            </View>
            <View style={styles.tagContainer}>
                {generateTagJSX(data4)}
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Uploader:</Text>
                <Text style={styles.text}>Moebytes</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Uploaded:</Text>
                <Text style={styles.text}>3-21-2023</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Type:</Text>
                <Text style={styles.text}>Image</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Rating:</Text>
                <Text style={styles.text}>Sexy</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Style:</Text>
                <Text style={styles.text}>2D</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Favorites:</Text>
                <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Cuteness:</Text>
                <Text style={styles.text}>595</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Resolution:</Text>
                <Text style={styles.text}>3192x4680</Text>
            </View>
            <View style={styles.rowItem}>
                <Text style={styles.highlightText}>Size:</Text>
                <Text style={styles.text}>518.52 KB</Text>
            </View>
        </ScrollView>
      </LiquidGlassView>
    </LiquidGlassContainerView>
  )
}

export default PostDrawer