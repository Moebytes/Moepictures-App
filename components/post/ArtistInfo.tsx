/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Text, Image, Linking} from "react-native"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/ArtistInfo.styles"
import {PostFull, TagCount} from "../../types/Types"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
    artists?: TagCount[]
}

const pixiv = require("../../assets/icons/pixiv.png")
const twitter = require("../../assets/icons/twitter.png")

const ArtistInfo: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const [artistPfp, setArtistPfp] = useState("")

    useEffect(() => {
        if (!props.artists) return
        let pfp = functions.link.getTagLink(props.artists[0])
        setArtistPfp(pfp)
    }, [props.artists])

    const onArtistPress = async () => {
        if (!props.post) return

        let appURL = ""
        let webURL = props.post.userProfile ?? ""

        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        } else if (webURL.includes("twitter.com") || webURL.includes("x.com")) {
            const userMatch = webURL.match(/twitter\.com\/([a-zA-Z0-9_]+)/) 
                || webURL.match(/x\.com\/([a-zA-Z0-9_]+)/)
            if (userMatch?.[1]) {
                const username = userMatch[1]
                appURL = `twitter://user?screen_name=${username}`
            }
        }

        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    const onSourcePress = async (link?: string) => {
        if (!props.post) return

        let appURL = ""
        let webURL = link ?? ""
        if (webURL.includes("pixiv")) {
            appURL = `pixiv://${webURL.split("//")[1]}`
        } else if (webURL.includes("twitter.com") || webURL.includes("x.com")) {
            const tweetMatch = webURL.match(/status\/(\d+)/)
            if (tweetMatch?.[1]) {
                const tweetID = tweetMatch[1]
                appURL = `twitter://status?id=${tweetID}`
            }
        }
        
        if (appURL && await Linking.canOpenURL(appURL)) {
            Linking.openURL(appURL)
        } else {
            Linking.openURL(webURL)
        }
    }

    const getSourceIcon = () => {
        if (!props.post) return null
        if (props.post?.source?.includes("pixiv.net")) {
            return (
                <ScalableHaptic scaleFactor={0.95} onPress={() => onSourcePress(props.post?.source)}>
                    <Image style={styles.sourceIcon} source={pixiv}/>
                </ScalableHaptic>
            )
        } else if (props.post?.source?.includes("twitter.com") || 
            props.post?.source?.includes("x.com")) {
            return (
                <ScalableHaptic scaleFactor={0.95} onPress={() => onSourcePress(props.post?.source)}>
                    <Image style={styles.sourceIcon} source={twitter}/>
                </ScalableHaptic>
            )
        }
    }

    const getMirrorIcon = () => {
        if (!props.post) return null
        if (props.post?.mirrors?.pixiv) {
            return (
                <ScalableHaptic scaleFactor={0.95} onPress={() => onSourcePress(props.post?.mirrors?.pixiv)}>
                    <Image style={styles.sourceIcon} source={pixiv}/>
                </ScalableHaptic>
            )
        } else if (props.post?.mirrors?.twitter) {
            return (
                <ScalableHaptic scaleFactor={0.95} onPress={() => onSourcePress(props.post?.mirrors?.twitter)}>
                    <Image style={styles.sourceIcon} source={twitter}/>
                </ScalableHaptic>
            )
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.artistContainer}>
                {artistPfp && <Image style={styles.artistIcon} source={{uri: artistPfp}}/>}
                <ScalableHaptic scaleFactor={0.95} onPress={onArtistPress}>
                    <Text style={styles.artistText}>{props.artists?.[0].tag}</Text>
                </ScalableHaptic>
                {getSourceIcon()}
                {getMirrorIcon()}
            </View>
        </View>
    )
}

export default ArtistInfo