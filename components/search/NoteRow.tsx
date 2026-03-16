/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Image, Text, ImageSourcePropType, useWindowDimensions} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/CommentRow.styles"
import DateIcon from "../../assets/svg/date.svg"
import functions from "../../functions/Functions"

const pfp = require("../../assets/images/pfp.jpg")

interface Props {
    img: ImageSourcePropType
}

const NoteRow: React.FunctionComponent<Props> = (props) => {
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    useEffect(() => {
        const updateSize = async () => {
            const size = await functions.image.dynamicResize(props.img, 120, width)
            setSize(size)
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    let pfpSize = 30
    let iconSize = 18

    return (
        <View style={styles.container}>
             <View style={styles.imageContainer}>
                <Image style={size} source={props.img} resizeMode="contain"/>
             </View>
            <View style={styles.textContainer}>
                <View style={styles.rowContainer}>
                    <Image style={{width: pfpSize, height: pfpSize, borderRadius: pfpSize / 2}} source={pfp} resizeMode="contain"/>
                    <Text style={styles.userText}>Moebytes</Text>
                </View>
                <View style={styles.rowContainer}>
                    <DateIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                    <Text style={styles.dateText}>2 weeks ago</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>{"Character -> chino-kafuu-(is-the-order-a-rabbit)\nCharacter -> fuiba-fuyu-(is-the-order-a-rabbit)"}</Text>
                </View>
            </View>
        </View>
    )
}

export default NoteRow