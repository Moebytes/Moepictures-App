/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {ScrollView, View, Text, TextInput, Animated, StatusBar, KeyboardAvoidingView} from "react-native"
import {useNavigation, RouteProp} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {StackParamList} from "../../App"
import {useGetPostQuery, useInvalidatePost} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import SlidingSelector from "../../ui/SlidingSelector"
import {useThemeSelector, useSessionSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import SearchSuggestions from "../../components/tooltip/SearchSuggestions"
import LeftIcon from "../../assets/svg/left.svg"
import ImageIcon from "../../assets/svg/image.svg"
import ComicIcon from "../../assets/svg/comic.svg"
import CuteIcon from "../../assets/svg/cute.svg"
import SexyIcon from "../../assets/svg/sexy.svg"
import EroticIcon from "../../assets/svg/erotic.svg"
import LewdIcon from "../../assets/svg/lewd.svg"
import $2DIcon from "../../assets/svg/2d.svg"
import $3DIcon from "../../assets/svg/3d.svg"
import ChibiIcon from "../../assets/svg/chibi.svg"
import PixelIcon from "../../assets/svg/pixel.svg"
import DakiIcon from "../../assets/svg/daki.svg"
import PromoIcon from "../../assets/svg/promo.svg"
import SketchIcon from "../../assets/svg/sketch.svg"
import LineartIcon from "../../assets/svg/lineart.svg"
import {createStylesheet} from "./styles/EditFavgroupScreen.styles"
import {PostType, PostRating, PostStyle, TagType, TagCount} from "../../types/Types"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

type Props = {
  route: RouteProp<StackParamList, "EditPost">
}

const EditPostScreen: React.FunctionComponent<Props> = ({route}) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {postID} = route.params
    const {data: post} = useGetPostQuery({postID})
    const [page, setPage] = useState("tags")
    const [type, setType] = useState("image" as PostType)
    const [rating, setRating] = useState("cute" as PostRating)
    const [style, setStyle] = useState("2d" as PostStyle)
    const [artists, setArtists] = useState("")
    const [characters, setCharacters] = useState("")
    const [series, setSeries] = useState("")
    const [rawTags, setRawTags] = useState("")
    const [metaTags, setMetaTags] = useState("")
    const [title, setTitle] = useState("")
    const [englishTitle, setEnglishTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [sourceImageCount, setSourceImageCount] = useState("")
    const [posted, setPosted] = useState("")
    const [bookmarks, setBookmarks] = useState("")
    const [source, setSource] = useState("")
    const [userProfile, setUserProfile] = useState("")
    const [commentary, setCommentary] = useState("")
    const [englishCommentary, setEnglishCommentary] = useState("")
    const [mirrors, setMirrors] = useState("")
    const [pixivTags, setPixivTags] = useState("")
    const [drawingTools, setDrawingTools] = useState("")
    const [buyLink, setBuyLink] = useState("")
    const [reason, setReason] = useState("")
    const [focused, setFocused] = useState(false)
    const [suggestionType, setSuggestionType] = useState("tags" as TagType)
    const [typingText, setTypingText] = useState("")
    const [selection, setSelection] = useState({start: 0, end: 0})
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const invalidatePost = useInvalidatePost()

    const editTags = async () => {
        if (!post) return
        let {tags, tagGroups} = functions.tag.parseTagGroups(functions.util.cleanHTML(rawTags))
        const joined = `${characters} ${series} ${tags.join(" ")} ${metaTags}`

        if (joined.includes("_") || joined.includes("/") || joined.includes("\\")) {
            return Toast.show({text1: i18n.pages.upload.invalidCharacters})
        }
        if (joined.includes(",")) {
            return Toast.show({text1: i18n.pages.upload.spaceSeparation})
        }
        if (!permissions.isMod(session) && tags.length < 5) {
            return Toast.show({text1: i18n.pages.upload.tagMinimum})
        }

        const data = {
            postID: post.postID,
            type,
            rating,
            style,
            artists: functions.util.cleanHTML(artists).split(/[\n\r\s]+/g),
            characters: functions.util.cleanHTML(characters).split(/[\n\r\s]+/g),
            series: functions.util.cleanHTML(series).split(/[\n\r\s]+/g),
            tags: functions.util.cleanHTML(`${tags.join(" ")} ${metaTags}`).split(/[\n\r\s]+/g),
            tagGroups,
            reason
        }
        if (permissions.isContributor(session)) {
            try {
                navigation.navigate("Post", {postID}, {pop: true})
                await functions.http.put("/api/post/quickedit", data, session)
                invalidatePost(postID)
                Toast.show({text1: i18n.banner.editedTags})
            } catch {
                return Toast.show({text1: i18n.toast.error})
            }
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})
            
            try {
                navigation.navigate("Post", {postID}, {pop: true})
                await functions.http.put("/api/post/quickedit/unverified", data, session)
                Toast.show({text1: i18n.toast.editRequest})
            } catch {
                return Toast.show({text1: i18n.toast.error})
            }
        }
    }

    const editSource = async () => {
        if (!post) return
        const data = {
            postID: post.postID,
            type: post.type,
            rating: post.rating,
            style:post.style,
            source: {
                title,
                englishTitle,
                artist,
                posted,
                source,
                commentary,
                englishCommentary,
                userProfile,
                bookmarks: functions.util.safeNumber(bookmarks),
                pixivTags: pixivTags.trim() ? pixivTags.split(",") : null,
                drawingTools: drawingTools.trim() ? drawingTools.split(",") : null,
                sourceImageCount: functions.util.safeNumber(sourceImageCount),
                buyLink,
                mirrors
            },
            reason
        }
        if (permissions.isContributor(session)) {
            try {
                navigation.navigate("Post", {postID}, {pop: true})
                await functions.http.put("/api/post/quickedit", data, session)
                invalidatePost(postID)
                Toast.show({text1: i18n.banner.editedSource})
            } catch {
                return Toast.show({text1: i18n.toast.error})
            }
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})
            
            try {
                navigation.navigate("Post", {postID}, {pop: true})
                await functions.http.put("/api/post/quickedit/unverified", data, session)
                Toast.show({text1: i18n.toast.editRequest})
            } catch {
                return Toast.show({text1: i18n.toast.error})
            }
        }
    }

    let pages = [
        {name: i18n.navbar.tags, value: "tags"},
        {name: i18n.labels.source, value: "source"}
    ]

    const updateTagFields = async () => {
        if (!post) return
        const tags = await functions.tag.parseTags([post], session)
        const categories = await functions.tag.tagCategories(tags, session)
        setType(post.type)
        setRating(post.rating)
        setStyle(post.style)
        setArtists(categories.artists.map((t) => t.tag).join(" "))
        setCharacters(categories.characters.map((t) => t.tag).join(" "))
        setSeries(categories.series.map((t) => t.tag).join(" "))
        setMetaTags(categories.meta.map((t) => t.tag).join(" "))
        setRawTags(functions.tag.parseTagGroupsField(categories.tags.map((t) => t.tag), post.tagGroups))
    }

    const updateSourceFields = () => {
        if (!post) return
        setTitle(post.title ?? "")
        setEnglishTitle(post.englishTitle ?? "")
        setArtist(post.artist ?? "")
        setCommentary(post.commentary ?? "")
        setEnglishCommentary(post.englishCommentary ?? "")
        setMirrors(post.mirrors ? Object.values(post.mirrors).join("\n") : "")
        setPosted(post.posted ? functions.date.formatDate(new Date(post.posted), true) : "")
        setSource(post.source ?? "")
        setBookmarks(String(post.bookmarks ?? ""))
        setBuyLink(post.buyLink ?? "")
        setPixivTags(post.pixivTags?.join(", ") ?? "")
        setDrawingTools(post.drawingTools?.join(", ") ?? "")
        setUserProfile(post.userProfile ?? "")
        setSourceImageCount(String(post.sourceImageCount ?? ""))
    }

    useEffect(() => {
        updateTagFields()
        updateSourceFields()
    }, [post, page])

    let hasPermission = permissions.isContributor(session)

    const generateTypeButtons = () => {
        let types = [
            {name: i18n.sortbar.type.image, icon: ImageIcon, value: "image"},
            {name: i18n.sortbar.type.comic, icon: ComicIcon, value: "comic"}
        ] as any

        return (
            <View style={styles.row}>
                <SlidingSelector
                    data={types}
                    value={type}
                    onChange={setType}
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

    const generateRatingButtons = () => {
        let ratings = [
            {name: i18n.sortbar.rating.cute, icon: CuteIcon, value: "cute"},
            {name: i18n.sortbar.rating.sexy, icon: SexyIcon, value: "sexy"},
            {name: i18n.sortbar.rating.erotic, icon: EroticIcon, value: "erotic"}
        ] as any

        let redRatings = [
            {name: i18n.sortbar.rating.lewd, icon: LewdIcon, value: "lewd"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={ratings}
                    value={rating}
                    onChange={setRating}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            {session.showR18 ? 
            <View style={styles.row}>
                <SlidingSelector
                    data={redRatings}
                    value={rating}
                    onChange={setRating}
                    inactiveColor={colors.optionRedInactive}
                    activeColor={colors.optionRedActive}
                    iconColor={colors.redIcon}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View> : null}
            </>
        )
    }

    const generateStyleButtons = () => {
        let postStyles = [
            {name: i18n.sortbar.style["2d"], icon: $2DIcon, value: "2d"},
            {name: i18n.sortbar.style["3d"], icon: $3DIcon, value: "3d"},
            {name: i18n.sortbar.style.chibi, icon: ChibiIcon, value: "chibi"}
        ] as any

        let postStyles2 = [
            {name: i18n.sortbar.style.pixel, icon: PixelIcon, value: "pixel"},
            {name: i18n.sortbar.style.daki, icon: DakiIcon, value: "daki"}
        ] as any

        let bluePostStyles = [
            {name: i18n.sortbar.style.promo, icon: PromoIcon, value: "promo"},
            {name: i18n.sortbar.style.sketch, icon: SketchIcon, value: "sketch"},
            {name: i18n.sortbar.style.lineart, icon: LineartIcon, value: "lineart"}
        ] as any

        return (
            <>
            <View style={styles.row}>
                <SlidingSelector
                    data={postStyles}
                    value={style}
                    onChange={setStyle}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={postStyles2}
                    value={style}
                    onChange={setStyle}
                    inactiveColor={colors.optionInactive}
                    activeColor={colors.optionActive}
                    iconColor={colors.iconColor}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            <View style={styles.row}>
                <SlidingSelector
                    data={bluePostStyles}
                    value={style}
                    onChange={setStyle}
                    inactiveColor={colors.optionBlueInactive}
                    activeColor={colors.optionBlueActive}
                    iconColor={colors.blueIcon}
                    activeIconColor={colors.white}
                    textColor={colors.textColor}
                    activeTextColor={colors.white}
                />
            </View>
            </>
        )
    }

    const inputFocus = (type: TagType) => {
        setFocused(true)
        setSuggestionType(type)
        setTypingText("")
    }

    const inputBlur = () => {
        setFocused(false)
    }

    const getTypingText = (text: string, cursor: number) => {
        const left = text.slice(0, cursor)
        const match = left.match(/([^\s\n\r]+)$/)
        return match ? match[1] : ""
    }

    const addSuggestion = (suggestion: TagCount) => {
        if (suggestion.type === "artist") {
            setArtists((prev) => prev + ` ${suggestion.tag}`)
        } else if (suggestion.type === "character") {
            setCharacters((prev) => prev + ` ${suggestion.tag}`)
        } else if (suggestion.type === "series") {
            setSeries((prev) => prev + ` ${suggestion.tag}`)
        } else if (suggestion.type === "meta") {
            setMetaTags((prev) => prev + ` ${suggestion.tag}`)
        } else {
            setRawTags((prev) => prev + ` ${suggestion.tag}`)
        }
    }

    const generatePageJSX = () => {
        if (page === "tags") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sidebar.type}</Text>
                </View>
                {generateTypeButtons()}
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sidebar.rating}</Text>
                </View>
                {generateRatingButtons()}
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sidebar.style}</Text>
                </View>
                {generateStyleButtons()}
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.navbar.artists}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 40, color: colors.artistTagColor}]}
                        selectionColor={colors.borderColor}
                        value={artists}
                        placeholder={i18n.placeholder.enterArtists}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                        onChangeText={(text) => {
                            setArtists(text)
                            setTypingText(getTypingText(text, selection.start))
                        }}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        onFocus={() => inputFocus("artist")}
                        onBlur={() => inputBlur()}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.navbar.characters}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 100, color: colors.characterTagColor}]}
                        selectionColor={colors.borderColor}
                        value={characters}
                        placeholder={i18n.placeholder.enterCharacters}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                        onChangeText={(text) => {
                            setCharacters(text)
                            setTypingText(getTypingText(text, selection.start))
                        }}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        onFocus={() => inputFocus("character")}
                        onBlur={() => inputBlur()}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.tag.series}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 100, color: colors.seriesTagColor}]}
                        selectionColor={colors.borderColor}
                        value={series}
                        placeholder={i18n.placeholder.enterSeries}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                        onChangeText={(text) => {
                            setSeries(text)
                            setTypingText(getTypingText(text, selection.start))
                        }}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        onFocus={() => inputFocus("series")}
                        onBlur={() => inputBlur()}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.tag.meta}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 100, color: colors.metaTagColor}]}
                        selectionColor={colors.borderColor}
                        value={metaTags}
                        placeholder={i18n.placeholder.enterMetaTags}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                        onChangeText={(text) => {
                            setMetaTags(text)
                            setTypingText(getTypingText(text, selection.start))
                        }}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        onFocus={() => inputFocus("meta")}
                        onBlur={() => inputBlur()}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.navbar.tags}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {fontSize: 16, height: 400}]}
                        selectionColor={colors.borderColor}
                        value={rawTags}
                        placeholder={i18n.placeholder.enterTags}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                        onChangeText={(text) => {
                            setRawTags(text)
                            setTypingText(getTypingText(text, selection.start))
                        }}
                        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                        onFocus={() => inputFocus("tags")}
                        onBlur={() => inputBlur()}
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
                    style={styles.wideButton} onPress={editTags}>
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
        } else if (page === "source") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.title}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={title}
                        onChangeText={setTitle}
                        placeholder={i18n.placeholder.enterTitle}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.englishTitle}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={englishTitle}
                        onChangeText={setEnglishTitle}
                        placeholder={i18n.placeholder.enterEnglishTitle}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.tag.artist}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={artist}
                        onChangeText={setArtist}
                        placeholder={i18n.placeholder.enterArtist}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sort.posted}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={posted}
                        onChangeText={setPosted}
                        placeholder={i18n.placeholder.enterPostedDate}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.imageCount}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={sourceImageCount}
                        onChangeText={setSourceImageCount}
                        placeholder={i18n.placeholder.enterImageCount}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.sort.bookmarks}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={bookmarks}
                        onChangeText={setBookmarks}
                        placeholder={i18n.placeholder.enterBookmarks}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.source}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={source}
                        onChangeText={setSource}
                        placeholder={i18n.placeholder.enterSource}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.userProfile}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={userProfile}
                        onChangeText={setUserProfile}
                        placeholder={i18n.placeholder.enterUserProfile}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.commentary}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.bigInput}
                        selectionColor={colors.borderColor}
                        value={commentary}
                        onChangeText={setCommentary}
                        placeholder={i18n.placeholder.enterCommentary}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.englishCommentary}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.bigInput}
                        selectionColor={colors.borderColor}
                        value={englishCommentary}
                        onChangeText={setEnglishCommentary}
                        placeholder={i18n.placeholder.enterEnglishCommentary}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.mirrors}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.bigInput}
                        selectionColor={colors.borderColor}
                        value={mirrors}
                        onChangeText={setMirrors}
                        placeholder={i18n.placeholder.enterMirrors}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.pixivTags}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.bigInput, {height: 100}]}
                        selectionColor={colors.borderColor}
                        value={pixivTags}
                        onChangeText={setPixivTags}
                        placeholder={i18n.placeholder.enterPixivTags}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.drawingTools}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={drawingTools}
                        onChangeText={setDrawingTools}
                        placeholder={i18n.placeholder.enterDrawingTools}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.buyLink}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={buyLink}
                        onChangeText={setBuyLink}
                        placeholder={i18n.placeholder.enterBuyLink}
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
                    style={styles.wideButton} onPress={editSource}>
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
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <SearchSuggestions active={focused} text={typingText} type={suggestionType} addSuggestion={addSuggestion}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.pages.edit.title}</Text>
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

export default EditPostScreen