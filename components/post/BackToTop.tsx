/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, FlatList} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import TriangleIcon from "../../assets/svg/back-to-top.svg"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/BackToTop.styles"

interface Props {
    ref: React.RefObject<FlatList | null>
}

const BackToTop: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const onPress = () => {
        props.ref.current?.scrollToOffset({offset: 0, animated: true})
    }

    let iconSize = 20

    return (
        <View style={styles.container}>
            <PressableHaptic style={styles.iconContainer} onPress={onPress}>
                <TriangleIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>{i18n.footer.top}</Text>
            </PressableHaptic>
        </View>
    )
}

export default BackToTop