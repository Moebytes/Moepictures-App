/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {View, Text, Animated, Switch} from "react-native"
import {TrueSheet} from "@lodev09/react-native-true-sheet"
import {useThemeSelector, useSheetSelector, useSheetActions, useSearchSelector,
useSearchActions} from "../store"
import ScalableHaptic from "../ui/ScalableHaptic"
import SlidingSelector from "../ui/SlidingSelector"
import {createStylesheet} from "./Sheet.styles"
import functions from "../functions/Functions"

const CommentsSheet: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {showCommentsSheet} = useSheetSelector()
    const {setShowCommentsSheet} = useSheetActions()
    const {commentSort, sortReverse} = useSearchSelector()
    const {setCommentSort, setSortReverse} = useSearchActions()
    const [localSort, setLocalSort] = useState(commentSort)
    const [localReverse, setLocalReverse] = useState(sortReverse)
    const styles = createStylesheet(colors)
    const sheet = useRef<TrueSheet>(null)

    useEffect(() => {
        if (showCommentsSheet) {
            sheet.current?.present()

            setLocalSort(commentSort)
            setLocalReverse(sortReverse)
            
            setShowCommentsSheet(false)
        }
    }, [showCommentsSheet])

    const reset = () => {
        setLocalSort("date")
        setLocalReverse(false)
    }

    const apply = () => {
        setCommentSort(localSort)
        setSortReverse(localReverse)

        sheet.current?.dismiss()
    }

    const generateSortButtons = () => {
        let sortOptions = [
            {name: i18n.sort.date, value: "date"},
            {name: i18n.sort.random, value: "random"}
        ] as any

        return (
            <View style={styles.row}>
                <SlidingSelector
                    data={sortOptions}
                    value={localSort}
                    onChange={setLocalSort}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
        )
    }

    return (
        <TrueSheet
            ref={sheet}
            detents={[0.85]}
            cornerRadius={30}
            grabber={false}
            backgroundColor={colors.background}
            style={{borderColor: colors.optionActive, borderWidth: 1, borderRadius: 30, height: "100%"}}>
            <View style={styles.container}>
                <View style={styles.centerRow}>
                    <Text style={styles.mainTitle}>{i18n.options.searchOptions}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.options.sort}</Text>
                </View>
                {generateSortButtons()}
                <View style={styles.row}>
                    <Text style={styles.title}>{i18n.labels.order}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.buttonText}>{i18n.labels.reverseOrder}</Text>
                        <Switch
                            value={localReverse}
                            onValueChange={() => setLocalReverse(!localReverse)}
                            thumbColor="#ffffff"
                            trackColor={{false: colors.switchOff, true: colors.switchOn}}
                            ios_backgroundColor={colors.switchOff}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.evenContainer}>
                        <ScalableHaptic scaleFactor={0.97} style={[styles.wideButton, 
                            {backgroundColor: colors.optionReset}]}
                            onPress={reset}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.black, colors.white],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.filters.reset}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                        <ScalableHaptic scaleFactor={0.97} style={styles.wideButton} onPress={apply}>
                            {({colorAnim}) => {
                                const color = colorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.white, colors.black],
                                })

                               return (
                                    <Animated.Text style={[styles.wideButtonText, {color}]}>
                                        {i18n.buttons.apply}
                                    </Animated.Text>
                                )
                            }}
                        </ScalableHaptic>
                    </View>
                </View>
            </View>
        </TrueSheet>
    )
}

export default CommentsSheet