/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {ScrollView, View, Text, TextInput, Animated, StatusBar} from "react-native"
import {useNavigation, RouteProp} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {StackParamList} from "../../App"
import {useGetTagQuery, useInvalidateTag, useInvalidateTags} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import SlidingSelector from "../../ui/SlidingSelector"
import {useThemeSelector, useSessionSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import CheckboxIcon from "../../assets/svg/checkbox.svg"
import CheckboxCheckedIcon from "../../assets/svg/checkbox-checked.svg"
import {createStylesheet} from "./styles/EditFavgroupScreen.styles"
import {TagType} from "../../types/ParamTypes"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

type Props = {
  route: RouteProp<StackParamList, "EditTag">
}

const EditTagScreen: React.FunctionComponent<Props> = ({route}) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {name} = route.params
    const {data: tag} = useGetTagQuery({tag: name})
    const [page, setPage] = useState("details")
    const [key, setKey] = useState("")
    const [featuredPost, setFeaturedPost] = useState("")
    const [description, setDescription] = useState("")
    const [social, setSocial] = useState("")
    const [twitter, setTwitter] = useState("")
    const [website, setWebsite] = useState("")
    const [fandom, setFandom] = useState("")
    const [wikipedia, setWikipedia] = useState("")
    const [aliases, setAliases] = useState("")
    const [implications, setImplications] = useState("")
    const [pixivTags, setPixivTags] = useState("")
    const [danbooruTag, setDanbooruTag] = useState("")
    const [type, setType] = useState("tag" as TagType)
    const [reason, setReason] = useState("")
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const invalidateTag = useInvalidateTag()
    const invalidateTags = useInvalidateTags()

    const edit = async () => {
        if (!tag) return
        let aliasArray = aliases.split(/\s+/g).filter(Boolean)
        let implicationArray = implications.split(/\s+/g).filter(Boolean)
        let pixivTagArray = pixivTags.split(/\s+/g).filter(Boolean)

        if (permissions.isContributor(session)) {
            try {
                await functions.http.put("/api/tag/edit", {tag: tag.tag, key: key.trim(), description,
                aliases: aliasArray, implications: implicationArray, pixivTags: pixivTagArray, 
                danbooruTag, social, twitter, website, fandom, wikipedia, featuredPost, reason}, session)

                invalidateTag(key)
                invalidateTags()
                navigation.navigate("Tag", {name: key}, {pop: true})
            } catch (err: any) {
                if (err.message.includes("No permission to edit implications") || err.message.includes("No permission to rename tag")) {
                    await functions.http.post("/api/tag/edit/request", {tag: tag.tag, key: key.trim(), description, 
                    aliases: aliasArray, implications: implicationArray, pixivTags: pixivTagArray,  
                    danbooruTag, social, twitter, website, fandom, wikipedia, featuredPost, reason}, session)

                    navigation.navigate("Tag", {name}, {pop: true})
                    return Toast.show({text1: i18n.toast.editRequest})
                } else {
                    return Toast.show({text1: i18n.toast.error})
                }
            }
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})

            try {
                await functions.http.post("/api/tag/edit/request", {tag: tag.tag, key: key.trim(), description, 
                aliases: aliasArray, implications: implicationArray, pixivTags: pixivTagArray, 
                danbooruTag, social, twitter, website, fandom, wikipedia, featuredPost, reason}, session)

                navigation.navigate("Tag", {name}, {pop: true})
                Toast.show({text1: i18n.toast.editRequest})
            } catch {
                return Toast.show({text1: i18n.toast.error})
            }
        }
    }

    const categorize = async () => {
        if (!tag) return
        if (permissions.isContributor(session)) {
            await functions.http.put("/api/tag/edit", {tag: tag.tag, type}, session)
            invalidateTag(tag.tag)
            invalidateTags()
            navigation.navigate("Tag", {name}, {pop: true})
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})

            await functions.http.post("/api/tag/edit/request", {tag: tag.tag, type, reason}, session)

            navigation.navigate("Tag", {name}, {pop: true})
            Toast.show({text1: i18n.toast.editRequest})
        }
    }

    let pages = [
        {name: i18n.sidebar.details, value: "details"},
        {name: i18n.labels.category, value: "category"}
    ]

    useEffect(() => {
        if (!tag) return
        setKey(tag.tag)
        setDescription(tag.description)
        setSocial(tag.social ?? "")
        setTwitter(tag.twitter ?? "")
        setWebsite(tag.website ?? "")
        setFandom(tag.fandom ?? "")
        setWikipedia(tag.wikipedia ?? "")
        setFeaturedPost(tag.featuredPost?.postID ?? "")
        setAliases(tag?.aliases.filter((a) => a?.alias).join(" ") ?? "")
        setImplications(tag.implications.filter((i) => i?.implication).join(" ") ?? "")
        setPixivTags(tag.pixivTags?.join(" ") ?? "")
        setDanbooruTag(tag.danbooruTag ?? "")
        setType(tag.type)
    }, [tag, page])

    let iconSize = 25
    let hasPermission = permissions.isContributor(session)

    const tagSocialJSX = () => {
        if (!tag) return
        if (tag.type === "artist") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.website}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={website}
                        onChangeText={setWebsite}
                        placeholder={i18n.placeholder.enterWebsite}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.social}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={social}
                        onChangeText={setSocial}
                        placeholder={i18n.placeholder.enterSocial}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.twitter}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={twitter}
                        onChangeText={setTwitter}
                        placeholder={i18n.placeholder.enterTwitter}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                </>
            )
        } else if (tag.type === "character") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.fandom}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={fandom}
                        onChangeText={setFandom}
                        placeholder={i18n.placeholder.enterFandom}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                </>
            )
        } else if (tag.type === "series") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.website}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={website}
                        onChangeText={setWebsite}
                        placeholder={i18n.placeholder.enterWebsite}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.twitter}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={twitter}
                        onChangeText={setTwitter}
                        placeholder={i18n.placeholder.enterTwitter}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.wikipedia}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={wikipedia}
                        onChangeText={setWikipedia}
                        placeholder={i18n.placeholder.enterWikipedia}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                </>
            )
        }
    }

    const generatePageJSX = () => {
        if (page === "details") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.tag.tag}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={key}
                        onChangeText={setKey}
                        placeholder={i18n.placeholder.enterTagName}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                {tagSocialJSX()}
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.featured}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={featuredPost}
                        onChangeText={setFeaturedPost}
                        placeholder={i18n.placeholder.enterFeaturedPost}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.description}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {fontSize: 15, height: 300}]}
                        selectionColor={colors.borderColor}
                        value={description}
                        onChangeText={setDescription}
                        placeholder={i18n.placeholder.enterTagDescription}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sort.aliases}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 70}]}
                        selectionColor={colors.borderColor}
                        value={aliases}
                        onChangeText={setAliases}
                        placeholder={i18n.placeholder.enterAliases}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.implications}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 70}]}
                        selectionColor={colors.borderColor}
                        value={implications}
                        onChangeText={setImplications}
                        placeholder={i18n.placeholder.enterImplications}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.pixivTags}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 70}]}
                        selectionColor={colors.borderColor}
                        value={pixivTags}
                        onChangeText={setPixivTags}
                        placeholder={i18n.placeholder.enterPixivTags}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.danbooruTag}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={danbooruTag}
                        onChangeText={setDanbooruTag}
                        placeholder={i18n.placeholder.enterDanbooruTag}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.reason}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={reason}
                        onChangeText={setReason}
                        placeholder={i18n.placeholder.enterReason}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.centerRow}>
                    <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "70%"}} 
                    style={styles.wideButton} onPress={edit}>
                    {({colorAnim}) => {
                        const color = colorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.white, colors.black],
                        })
                        return (
                            <Animated.Text style={[styles.wideButtonText, {color}]}>
                                {hasPermission ? i18n.buttons.edit : i18n.buttons.submitRequest}
                            </Animated.Text>
                        )
                    }}
                    </ScalableHaptic>
                </View>
                </>
            )
        } else if (page === "category") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.category}</Text>
                </View>
                <View style={styles.tagColumn}>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("artist")}>
                        {type === "artist" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.artistTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.artistTagColor}/>}
                        <Text style={[styles.label, {color: colors.artistTagColor}]}>{i18n.tag.artist}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("character")}>
                        {type === "character" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.characterTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.characterTagColor}/>}
                        <Text style={[styles.label, {color: colors.characterTagColor}]}>{i18n.tag.character}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("series")}>
                        {type === "series" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.seriesTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.seriesTagColor}/>}
                        <Text style={[styles.label, {color: colors.seriesTagColor}]}>{i18n.tag.series}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("meta")}>
                        {type === "meta" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.metaTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.metaTagColor}/>}
                        <Text style={[styles.label, {color: colors.metaTagColor}]}>{i18n.tag.meta}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("appearance")}>
                        {type === "appearance" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.appearanceTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.appearanceTagColor}/>}
                        <Text style={[styles.label, {color: colors.appearanceTagColor}]}>{i18n.tag.appearance}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("outfit")}>
                        {type === "outfit" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.outfitTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.outfitTagColor}/>}
                        <Text style={[styles.label, {color: colors.outfitTagColor}]}>{i18n.tag.outfit}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("accessory")}>
                        {type === "accessory" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.accessoryTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.accessoryTagColor}/>}
                        <Text style={[styles.label, {color: colors.accessoryTagColor}]}>{i18n.tag.accessory}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("action")}>
                        {type === "action" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.actionTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.actionTagColor}/>}
                        <Text style={[styles.label, {color: colors.actionTagColor}]}>{i18n.tag.action}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("scenery")}>
                        {type === "scenery" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.sceneryTagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.sceneryTagColor}/>}
                        <Text style={[styles.label, {color: colors.sceneryTagColor}]}>{i18n.tag.scenery}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.tagBox} onPress={() => setType("tag")}>
                        {type === "tag" ?
                        <CheckboxCheckedIcon width={iconSize} height={iconSize} color={colors.tagColor}/> :
                        <CheckboxIcon width={iconSize} height={iconSize} color={colors.tagColor}/>}
                        <Text style={[styles.label, {color: colors.tagColor}]}>{i18n.tag.tag}</Text>
                    </PressableHaptic>
                </View>
                {!hasPermission ? <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.reason}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={reason}
                        onChangeText={setReason}
                        placeholder={i18n.placeholder.enterReason}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View></> : null}
                <View style={styles.centerRow}>
                    <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "70%"}} 
                    style={styles.wideButton} onPress={categorize}>
                    {({colorAnim}) => {
                        const color = colorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.white, colors.black],
                        })
                        return (
                            <Animated.Text style={[styles.wideButtonText, {color}]}>
                                {hasPermission ? i18n.buttons.categorize : i18n.buttons.submitRequest}
                            </Animated.Text>
                        )
                    }}
                    </ScalableHaptic>
                </View>
                </>
            )
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.dialogs.editTag.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.container}>
                <View style={styles.centerRow}>
                    <SlidingSelector
                        data={pages}
                        value={page}
                        onChange={setPage}
                        paddingHorizontal={30}
                    />
                </View>
                {generatePageJSX()}
            </ScrollView>
        </View>
    )
}

export default EditTagScreen