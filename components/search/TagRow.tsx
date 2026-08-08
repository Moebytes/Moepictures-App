/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, ScrollView, Image, Pressable} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TagRow.styles"
import {TagSearch} from "../../types/Types"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"

const pixiv = require("../../assets/icons/pixiv.png")
const twitter = require("../../assets/icons/twitter.png")
const website = require("../../assets/icons/website.png")
const wikipedia = require("../../assets/icons/wikipedia.png")
const fandom = require("../../assets/icons/fandom.png")

interface Props {
    tag: TagSearch
}

const TagRow: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const socialIcons = () => {
        let jsx = [] as React.ReactElement[]
        if (props.tag.website) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.tag.website)}>
                    <Image style={styles.icon} source={website}/>
                </ScalableHaptic>
            )
        }
        if (props.tag.fandom) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.tag.fandom)}>
                    <Image style={styles.icon} source={fandom}/>
                </ScalableHaptic>
            )
        }
        if (props.tag.social) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.tag.social)}>
                    <Image style={styles.icon} source={pixiv}/>
                </ScalableHaptic>
            )
        }
        if (props.tag.twitter) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.tag.twitter)}>
                    <Image style={styles.icon} source={twitter}/>
                </ScalableHaptic>
            )
        }
        if (props.tag.wikipedia) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(props.tag.wikipedia)}>
                    <Image style={styles.icon} source={wikipedia}/>
                </ScalableHaptic>
            )
        }
        return jsx
    }

    const generateAliasesJSX = () => {
        let jsx = [] as React.ReactElement[] 
        for (let i = 0; i < props.tag.aliases.length; i++) {
            jsx.push(<Text style={styles.impliesTag}>{props.tag.aliases[i]?.alias.replace(/-/g, " ")}</Text>)
        }
        return jsx
    }

    const generateImplicationsJSX = () => {
        let jsx = [] as React.ReactElement[]  
        for (let i = 0; i < props.tag.implications.length; i++) {
            jsx.push(<Text style={styles.impliesTag}>{props.tag.implications[i]?.implication.replace(/-/g, " ")}</Text>)
        }
        return jsx
    }

    return (
        <View style={styles.container}>
            <View style={styles.tagContainer}>
                {props.tag.image && <Image style={styles.image} src={functions.link.getTagLink(props.tag)}/>}
                <Pressable onPress={() => navigation.navigate("Tag", {name: props.tag.tag})}>
                    <Text style={{...styles.tag, color: functions.tag.getTagColor(props.tag, colors)}}>
                        {props.tag.tag.replace(/-/g, " ")}
                    </Text>
                </Pressable>
                <Text style={styles.count}>{props.tag.postCount}</Text>
                {socialIcons()}
                {props.tag.aliases?.[0] ?
                <View style={styles.impliesContainer}>
                    <Text style={styles.impliesHeader}>{i18n.sort.aliases}:</Text>
                    {generateAliasesJSX()}
                </View> : null}
                {props.tag.implications?.[0] ?
                <View style={styles.impliesContainer}>
                    <Text style={styles.impliesHeader}>{i18n.labels.implies}:</Text>
                    {generateImplicationsJSX()}
                </View> : null}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: 150}} contentContainerStyle={styles.textContainer}>
                {moeText.renderCommentaryText(props.tag.description, colors)}
            </ScrollView>
        </View>
    )
}

export default TagRow