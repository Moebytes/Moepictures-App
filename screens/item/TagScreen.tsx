/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState} from "react"
import {View, Image, StatusBar, FlatList, Linking, useWindowDimensions} from "react-native"
import Alert from "@blazejkustra/react-native-alert"
import {UITextView as Text} from "@bsky.app/react-native-uitextview"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import Toast from "react-native-toast-message"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, 
useSearchSelector, useSearchActions, useFlagActions, useCacheActions,
useTagDialogActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetTagQuery, useGetTagHistoryQuery, useInvalidateTag, useInvalidateTags} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GridImage from "../../components/image/GridImage"
import Related, {useRelatedItems} from "../../components/post/Related"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import HeartIcon from "../../assets/svg/heart.svg"
import HistoryIcon from "../../assets/svg/history.svg"
import EditIcon from "../../assets/svg/edit.svg"
import AliasIcon from "../../assets/svg/all.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {createStylesheet} from "./styles/TagScreen.styles"
import RevertIcon from "../../assets/svg/backspace.svg"
import CurrentIcon from "../../assets/svg/current.svg"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import {TagHistory} from "../../types/Types"
import moeText from "../../moetext/MoeText"

const pixiv = require("../../assets/icons/pixiv.png")
const twitter = require("../../assets/icons/twitter.png")
const website = require("../../assets/icons/website.png")
const wikipedia = require("../../assets/icons/wikipedia.png")
const fandom = require("../../assets/icons/fandom.png")

type Props = {
  route: RouteProp<StackParamList, "Tag">
}

const TagScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {scroll, sizeType, square} = useSearchSelector()
    const {setSearchTags, setSearch} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {setNavigationPosts} = useCacheActions()
    const {setAliasTagID} = useTagDialogActions()
    const {width} = useWindowDimensions()
    const {name, historyID} = route.params
    const [refreshKey, setRefreshKey] = useState(0)
    const {data: currentTag} = useGetTagQuery({tag: name, refreshKey})
    const {data: historyTags} = useGetTagHistoryQuery({tag: name, historyID}, {skip: !historyID})
    const styles = createStylesheet(colors)
    const [activePixivTag, setActivePixivTag] = useState("")
    const [activeAlias, setActiveAlias] = useState("")
    const [favorited, setFavorited] = useState(false)
    const [relatedTags, setRelatedTags] = useState([] as string[])
    const ref = useRef<FlatList>(null)
    const navigation = useNavigation()
    const invalidateTag = useInvalidateTag()
    const invalidateTags = useInvalidateTags()

    const historyTag = historyID && historyTags?.length ? historyTags[0] : null
    let tag = historyTag ?? currentTag

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0})
    }, [route.params])
    
    const related = useRelatedItems({tag: name})

    const onRelatedPress = () => {
        if (related.posts.length) {
            setNavigationPosts(related.posts)
        }
    }

    const {columns} = functions.image.getImageSize(sizeType, square, tablet, width)

    const getFavorite = async () => {
        if (!session.username) return
        const tagFavorite = await functions.http.get("/api/tagfavorite", {tag: name}, session)
        setFavorited(tagFavorite ? true : false)
    }

    const updateRelatedTags = async () => {
        const related = await functions.http.get("/api/tag/related", {tag: name}, session)
        setRelatedTags(related)
    }

    useEffect(() => {
        getFavorite()
        updateRelatedTags()
    }, [session])

    const socialIcons = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx
        if (tag.website) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.website)}>
                    <Image style={styles.icon} source={website}/>
                </ScalableHaptic>
            )
        }
        if (tag.fandom) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.fandom)}>
                    <Image style={styles.icon} source={fandom}/>
                </ScalableHaptic>
            )
        }
        if (tag.social) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.social)}>
                    <Image style={styles.icon} source={pixiv}/>
                </ScalableHaptic>
            )
        }
        if (tag.twitter) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.twitter)}>
                    <Image style={styles.icon} source={twitter}/>
                </ScalableHaptic>
            )
        }
        if (tag.wikipedia) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.wikipedia)}>
                    <Image style={styles.icon} source={wikipedia}/>
                </ScalableHaptic>
            )
        }
        return jsx
    }

    const pixivTags = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (const pixivTag of tag.pixivTags ?? []) {
            if (!pixivTag) continue
            const isActive = activePixivTag === pixivTag

            const onPress = async () => {
                Linking.openURL(`https://www.pixiv.net/tags/${encodeURIComponent(pixivTag)}/artworks`)
                setActivePixivTag("")
            }

            jsx.push(
                <PressableHaptic key={pixivTag} delayLongPress={200} onLongPress={() => null}
                    onPressIn={() => setActivePixivTag(pixivTag)} onPress={onPress} onPressOut={() => setActivePixivTag("")}
                    style={[styles.pixivTagContainer, isActive && styles.pixivTagContainerActive]}>
                    <Text style={[styles.pixivTag, isActive && styles.pixivTagActive]}>{pixivTag}</Text>
                </PressableHaptic>
            )
        }
        return jsx
    }

    const aliases = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (const alias of tag.aliases ?? []) {
            if (!alias) continue
            let aliasTag = typeof alias === "string" ? alias : alias.alias
            let aliasStr = aliasTag?.replace(/-/g, " ")
            const isActive = activeAlias === aliasTag

            const onPress = async () => {
                setSearchTags([aliasTag])
                setSearch(aliasTag)
                navigation.navigate("Posts", undefined, {pop: true})
                setActiveAlias("")
            }

            jsx.push(
                <PressableHaptic key={aliasTag} delayLongPress={200} onLongPress={() => null}
                    onPressIn={() => setActiveAlias(aliasTag)} onPress={onPress} onPressOut={() => setActiveAlias("")}
                    style={[styles.aliasTagContainer, isActive && styles.aliasTagContainerActive]}>
                    <Text style={[styles.aliasTag, isActive && styles.aliasTagActive]}>{aliasStr}</Text>
                </PressableHaptic>
            )
        }
        return jsx
    }

    const implications = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (let i = 0; i < (tag.implications ?? []).length; i++) {
            const implication = tag.implications[i]
            let implicationTag = typeof implication === "string" ? implication : implication?.implication
            let implicationStr = implicationTag?.replace(/-/g, " ")
            if (!implicationStr) continue
            if (i !== tag.implications.length - 1) implicationStr += ", "

            const onPress = async () => {
                // @ts-ignore
                navigation.push("Tag", {name: implicationTag})
            }

            jsx.push(
                <PressableHaptic key={implicationTag} delayLongPress={200} onLongPress={() => null}
                    onPress={onPress}>
                    <Text style={styles.implicationTag}>{implicationStr}</Text>
                </PressableHaptic>
            )
        }
        if (jsx.length) {
            return (
                <View style={[styles.rowContainer, {gap: 5}]}>
                    <Text style={styles.italicText}>{i18n.pages.tag.implication}</Text>
                    {jsx}
                </View>
            )

        } else {
            return null
        }
    }

    const relatedTagsJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (let i = 0; i < relatedTags.length; i++) {
            let relatedTag = relatedTags[i].replace(/-/g, " ")
            if (!relatedTag) continue
            if (i !== relatedTags.length - 1) relatedTag += ", "

            const onPress = async () => {
                // @ts-ignore
                navigation.push("Tag", {name: relatedTags[i]})
            }

            jsx.push(
                <PressableHaptic key={relatedTags[i]} delayLongPress={200} onLongPress={() => null}
                    onPress={onPress}>
                    <Text style={styles.implicationTag}>{relatedTag}</Text>
                </PressableHaptic>
            )
        }
        if (jsx.length) {
            return (
                <View style={[styles.rowContainer, {gap: 5}]}>
                    <Text style={styles.italicText}>{i18n.pages.tag.relatedTags}</Text>
                    {jsx}
                </View>
            )

        } else {
            return null
        }
    }

    const tagHistory = () => {
        if (!tag) return
        navigation.navigate("TagHistory", {name}, {pop: true})
    }

    const editTag = () => {
        if (!tag) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        navigation.navigate("EditTag", {name}, {pop: true})
    }

    const aliasTag = () => {
        if (!tag) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        setAliasTagID(tag.tag)
    }

    const deleteTag = () => {
        if (!tag) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        if (permissions.isMod(session)) {
            Alert.alert(i18n.dialogs.deleteTag.title, i18n.dialogs.deleteTag.header, [
                {text: i18n.buttons.cancel, style: "cancel"},
                {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                    await functions.http.delete("/api/tag/delete", {tag: tag.tag}, session)
                    navigation.navigate("Tags", undefined, {pop: true})
                    invalidateTags()
                }}
            ], {cancelable: true})
        } else {
            Alert.prompt(i18n.dialogs.deleteTag.request, i18n.dialogs.deleteTag.reasonHeader, [
                {text: i18n.buttons.cancel, style: "cancel"},
                {text: i18n.buttons.submitRequest, style: "destructive", onPress: async (reason = "") => {
                    await functions.http.post("/api/tag/delete/request", {tag: tag.tag, reason}, session)
                    Toast.show({text1: i18n.dialogs.deleteGroup.submitText})
                }}
            ], "plain-text", "", "default", {cancelable: true})
        }
    }

    const pressAction = () => {
        if (!tag) return
        ReactNativeHapticFeedback.trigger("impactMedium")
        setSearchTags([tag.tag])
        setSearch(tag.tag)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
    }

    const favoriteTag = async () => {
        if (!tag) return
        await functions.http.post("/api/tagfavorite/toggle", {tag: tag.tag}, session)
        getFavorite()
    }

    const revertHistory = async () => {
        if (!historyTag) return
        Alert.alert(i18n.dialogs.revertTagHistory.title, i18n.dialogs.revertGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.revert, style: "destructive", onPress: async () => {
                let image = null as number[] | ["delete"] | null
                if (!historyTag.image) {
                    image = ["delete"]
                } else {
                    const imageLink = functions.link.getTagLink(historyTag)
                    const arrayBuffer = await fetch(imageLink).then((r) => r.arrayBuffer())
                    const bytes = new Uint8Array(arrayBuffer)
                    image = Object.values(bytes)
                }
                await functions.http.put("/api/tag/edit", {tag: historyTag.tag, key: historyTag.key, description: historyTag.description, image,
                aliases: historyTag.aliases, implications: historyTag.implications, pixivTags: historyTag.pixivTags, social: historyTag.social,
                twitter: historyTag.twitter, website: historyTag.website, fandom: historyTag.fandom, wikipedia: historyTag.wikipedia, 
                type: historyTag.type, featuredPost: historyTag.featuredPost?.postID, r18: historyTag.r18 ?? false}, session)
                currentHistory(historyTag.key)
            }}
        ], {cancelable: true})
    }

    const currentHistory = async (key?: string) => {
        invalidateTag(name)
        navigation.navigate("Tag", {name: key ? key : name}, {pop: true})
        setRefreshKey((prev) => prev + 1)
    }

    const historyBarJSX = () => {
        if (!historyID) return null
        return (
            <View style={styles.historyContainer}>
                <Text style={styles.historyText}>{`[${i18n.sidebar.history}: ${historyID}]`}</Text>

                {permissions.isContributor(session) ?
                <PressableHaptic onPress={revertHistory} style={({pressed}) => [
                    styles.historyButton, pressed && styles.historyButtonActive
                ]}>{({pressed}) => (
                    <>
                    <RevertIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
                    <Text style={[styles.historyButtonText, 
                        pressed && styles.historyButtonTextActive]}>{i18n.buttons.revert}</Text>
                    </>
                )}
                </PressableHaptic> : null}

                <PressableHaptic onPress={() => currentHistory()} style={({pressed}) => [
                    styles.historyButton, pressed && styles.historyButtonActive
                ]}>{({pressed}) => (
                    <>
                    <CurrentIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
                    <Text style={[styles.historyButtonText, 
                        pressed && styles.historyButtonTextActive]}>{i18n.buttons.current}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
        )
    }

    let iconSize = 30

    const getTagName = () => {
        if (!tag) return
        if (historyID && (tag as TagHistory).key) return functions.util.toProperCase((tag as TagHistory).key.replace(/-/g, " "))
        return functions.util.toProperCase(tag.tag.replace(/-/g, " "))
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <FlatList
            ListHeaderComponent={
                <>
                <TitleBar/>
                <View style={styles.navContainer}>
                    <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                    {({pressed}) => (
                        <>
                        <LeftIcon width={24} height={24} color={colors.iconColor}/>
                        <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>
                            {i18n.tag.tag}
                        </Text>
                        </>
                    )}
                    </PressableHaptic>
                </View>
                {tag && <>
                <View style={styles.container}>
                    {historyBarJSX()}
                    <View style={styles.rowContainer}>
                        {tag.image && <Image style={styles.image} src={functions.link.getTagLink(tag)}/>}
                        <Text style={[styles.tag, {color: functions.tag.getTagColor(tag, colors)}]}>
                            {getTagName()}
                        </Text>
                        {socialIcons()}
                        {session.username ? <>
                        <ScalableHaptic onPress={favoriteTag}>
                            <HeartIcon width={iconSize} height={iconSize} color={favorited ? colors.favoriteColor : colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={tagHistory}>
                            <HistoryIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={editTag}>
                            <EditIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={aliasTag}>
                            <AliasIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={deleteTag}>
                            <DeleteIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                        </ScalableHaptic></> : null}
                    </View>

                    {tag.pixivTags?.length && <View style={styles.rowContainer}>
                        {pixivTags()}
                    </View>}

                    {tag.aliases?.length && <View style={styles.rowContainer}>
                        {aliases()}
                    </View>}


                    <View style={styles.textContainer}>
                        {moeText.renderCommentaryText(tag.description, colors)}
                    </View>

                    {tag.implications?.length && implications()}
                    {relatedTags?.length && relatedTagsJSX()}
                </View></>}
                <Related count={related.totalItems} pressAction={pressAction}/>
                </>
            }
            ref={ref}
            key={columns}
            data={related.posts}
            renderItem={({item}) => <GridImage post={item} onPress={onRelatedPress}/>}
            keyExtractor={(item) => item.postID.toString()}
            numColumns={columns}
            columnWrapperStyle={columns !== 1 ? styles.row : undefined}

            onEndReached={scroll ? related.loadMore : undefined}
            onEndReachedThreshold={scroll ? 0.1 : undefined}

            contentContainerStyle={{backgroundColor: colors.background}}
            ListHeaderComponentStyle={{paddingBottom: 10}}
            ListFooterComponentStyle={{paddingTop: 10}}

            ListFooterComponent={!scroll ? <>
                <PageButtons page={related.page} setPage={related.setPage} 
                totalPages={related.totalPages} hideEndArrow={true}
                marginBottom={20}/>
                <BackToTop ref={ref}/>
                <TabBar relative={true}/>
                </> : <>
                <BackToTop ref={ref}/>
                <TabBar relative={true}/>
                </>}
            />
        </View>
    )
}

export default TagScreen