/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Text, Image, Pressable, Linking} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/ArtistInfo.styles"
import {PostFull, TagCount} from "../../types/Types"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
    artists?: TagCount[]
}

const pixiv = require("../../assets/icons/pixiv.png")

const ArtistInfo: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [artistPfp, setArtistPfp] = useState("")

    useEffect(() => {
        if (!props.artists) return
        let pfp = functions.link.getTagLink("artist", props.artists[0].image, props.artists[0].imageHash)
        setArtistPfp(pfp)
    }, [props.artists])

    const onArtistPress = async () => {
        if (!props.post) return

        let appURL = ""
        let webURL = props.post.userProfile ?? ""
        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        }

        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    const onSourcePress = async () => {
        if (!props.post) return

        let appURL = ""
        let webURL = props.post.source ?? ""
        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        }
        
        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.artistContainer}>
                {artistPfp && <Image style={styles.artistIcon} source={{uri: artistPfp}}/>}
                <Pressable onPress={onArtistPress}>
                    <Text style={styles.artistText}>{props.artists?.[0].tag}</Text>
                </Pressable>
            </View>
            <Pressable onPress={onSourcePress}>
                <Image style={styles.sourceIcon} source={pixiv}/>
            </Pressable>
        </View>
    )
}

export default ArtistInfo