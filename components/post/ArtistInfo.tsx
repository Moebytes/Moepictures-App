/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, Text, Image, Pressable, Linking} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/ArtistInfo.styles"

const pixiv = require("../../assets/icons/pixiv.png")
const artistImage = require("../../assets/images/placeholder/artist.jpg")

const ArtistInfo: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const onArtistPress = async () => {
        let appURL = `pixiv://www.pixiv.net/users/4292709`
        let webURL = `https://www.pixiv.net/users/4292709`
        if (await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    const onSourcePress = async () => {
        let appURL = `pixiv://www.pixiv.net/artworks/85398657`
        let webURL = `https://www.pixiv.net/artworks/85398657`
        if (await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.artistContainer}>
                <Image style={styles.artistIcon} source={artistImage}/>
                <Pressable onPress={onArtistPress}>
                    <Text style={styles.artistText}>mozukun43</Text>
                </Pressable>
            </View>
            <Pressable onPress={onSourcePress}>
                <Image style={styles.sourceIcon} source={pixiv}/>
            </Pressable>
        </View>
    )
}

export default ArtistInfo