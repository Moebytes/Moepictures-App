/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {LiquidGlassView, isLiquidGlassSupported} from "@callstack/liquid-glass"
import {View, Text, Modal, Pressable, ScrollView} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useThemeSelector, useSearchDialogSelector, useSearchDialogActions,
useSearchActions, useSearchSelector, useSessionSelector} from "../../store"
import {createStylesheet} from "../Dialog.styles"
import {PostSort} from "../../types/Types"
import CheckIcon from "../../assets/svg/check.svg"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

const SortDialog: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {showSortDialog} = useSearchDialogSelector()
    const {setShowSortDialog} = useSearchDialogActions()
    const {sortType, sortReverse} = useSearchSelector()
    const {setSortType, setSortReverse} = useSearchActions()
    const styles = createStylesheet(colors)

    const click = (sort: PostSort) => {
        setSortType(sort)
        setShowSortDialog(false)
    }

    const reverse = () => {
        setSortReverse(!sortReverse)
        setShowSortDialog(false)
    }

    const generateOptions = () => {
        let jsx = [] as React.ReactElement[]

        let sortModes = [
            "random", "date", "posted", "bookmarks", "favorites", "popularity",
            "cuteness", "variations", "parent", "child", "groups", "tagcount", "filesize",
            "aspectRatio", "hidden", "locked", "private"
        ] as const

        if (!session.username) {
            sortModes = functions.util.removeItem(sortModes as any, "bookmarks") as any
            sortModes = functions.util.removeItem(sortModes as any, "favorites") as any
        }

        if (!permissions.isMod(session)) {
            sortModes = functions.util.removeItem(sortModes as any, "hidden") as any
            sortModes = functions.util.removeItem(sortModes as any, "locked") as any
            sortModes = functions.util.removeItem(sortModes as any, "private") as any
        }

        for (let i = 0; i < sortModes.length; i++) {
            const sort = sortModes[i]
            const selected = sort === sortType

            jsx.push(
                <PressableHaptic 
                    key={sort}
                    hitSlop={{left: 100, right: 100, top: 20, bottom: 20}} 
                    style={styles.rowButton} 
                    onPress={() => click(sort)}>
                    {({pressed}) => (
                        <>
                        <View style={[styles.rowContent, pressed && {transform: [{scale: 1.1}]}]}>
                            <Text style={styles.text}>
                                {i18n.sort[sort]}
                            </Text>

                            {selected && (
                                <CheckIcon width={22} height={22} color={colors.textColor}/>
                            )}
                        </View>
                        </>
                    )}
                </PressableHaptic>
            )
            if (i < sortModes.length - 1) jsx.push(
                <View style={styles.row}>
                    <View style={styles.separator}/>
                </View>
            )
        }
        return jsx
    }

    const fallback = !isLiquidGlassSupported
        ? {backgroundColor: "rgba(255,255,255,0.2)"}
        : undefined

    if (showSortDialog) {
        return (
            <Modal transparent visible={showSortDialog} animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setShowSortDialog(false)}>
                <LiquidGlassView effect="clear" style={[styles.scrollerContainer, fallback]}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: 450}} 
                        contentContainerStyle={styles.scrollContainer}>
                        <PressableHaptic 
                            hitSlop={{left: 100, right: 100, top: 20, bottom: 20}} 
                            style={styles.rowButton} 
                            onPress={() => reverse()}>
                            {({pressed}) => (
                                <>
                                <Text style={[styles.text, pressed && {transform: [{scale: 1.1}]}]}>
                                    {i18n.sort.reverse}
                                </Text>
                                </>
                            )}
                        </PressableHaptic>

                        <View style={styles.row}>
                            <View style={styles.separator}/>
                        </View>

                        {generateOptions()}
                    </ScrollView>
                </LiquidGlassView>
                </Pressable>
            </Modal>
        )
    }
}

export default SortDialog