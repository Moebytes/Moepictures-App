/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList, ScrollView} from "react-native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import TriangleIcon from "../../assets/svg/back-to-top.svg"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/BackToTop.styles"

interface Props {
    ref: React.RefObject<FlatList | ScrollView | null>
}

const BackToTop: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const onPress = () => {
        if (props.ref.current instanceof FlatList) {
            props.ref.current?.scrollToOffset({offset: 0, animated: true})
        } else {
            props.ref.current?.scrollTo({y: 0, animated: true})
        }
    }

    let iconSize = 20

    return (
        <View style={styles.container}>
            <ScalableHaptic scaleFactor={0.95} style={styles.iconContainer} onPress={onPress}>
                <TriangleIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>{i18n.footer.top}</Text>
            </ScalableHaptic>
        </View>
    )
}

export default BackToTop