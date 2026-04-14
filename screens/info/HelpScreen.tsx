/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {View, ScrollView, Text, Image, StatusBar, useWindowDimensions} from "react-native"
import {TabView, SceneMap, TabBar as DefaultTabBar, SceneRendererProps, NavigationState} from "react-native-tab-view"
import {useNavigation} from "@react-navigation/native"
import PressableHaptic from "../../ui/PressableHaptic"
import {useLayoutSelector, useThemeSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import TabBar from "../../components/app/TabBar"
import {createStylesheet} from "./styles/HelpScreen.styles"
import Link from "../../moetext/Link"
import {siteURL} from "../../ui/site"
import functions from "../../functions/Functions"

const helpImg = require("../../assets/images/help.jpg")
const searchImg = require("../../assets/images/search.jpg")
const imageSearchImg = require("../../assets/images/image-search.jpg")
const filtersImg = require("../../assets/images/filters.jpg")
const favoritesImg = require("../../assets/images/favorites.jpg")
const favoriteGroupsImg = require("../../assets/images/favorite-groups.jpg")
const cutenessImg = require("../../assets/images/cuteness.jpg")
const moetextImg = require("../../assets/images/moetext.jpg")
const tagGroupsImg = require("../../assets/images/tag-groups.jpg")
const variationsImg = require("../../assets/images/variations.jpg")
const childPostsImg = require("../../assets/images/child-posts.jpg")
const groupsImg = require("../../assets/images/groups.jpg")
const aliasesImg = require("../../assets/images/aliases.jpg")
const implicationsImg = require("../../assets/images/implications.jpg")
const usersImg = require("../../assets/images/users.jpg")
const websiteImg = require("../../assets/images/website.png")

const HelpTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(helpImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.help.help.welcome}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.help.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.help.line2}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={helpImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const SearchTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(searchImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.mobileHelp.search.title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.search.line1}
                </Text>
                <View style={styles.column}>
                    <Text style={styles.textAlt}>
                        {i18n.help.searching.example1}
                    </Text>
                    <Text style={styles.textAlt}>
                        {i18n.help.searching.example2}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.search.specialModifiers.header}
                    </Text>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialModifiers.items)[0]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialModifiers.items)[0]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialModifiers.items)[1]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialModifiers.items)[1]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialModifiers.items)[2]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialModifiers.items)[2]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialModifiers.items)[3]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialModifiers.items)[3]}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.search.specialSearches.header}
                    </Text>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[0]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[0]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[1]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[1]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[2]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[2]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[3]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[3]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[4]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[4]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[5]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[5]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[6]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[6]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[7]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[7]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[8]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[8]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[9]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[9]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[10]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[10]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.mobileHelp.search.specialSearches.items)[11]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.search.specialSearches.items)[11]}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.search.borderColors.header}
                    </Text>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[0]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[0]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[1]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[1]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[2]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[2]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[3]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[3]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[4]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[4]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[5]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[5]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textAlt}>
                            {Object.keys(i18n.help.searching.borderColors.items)[6]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.help.searching.borderColors.items)[6]}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={searchImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const ImageSearchTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(imageSearchImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.mobileHelp.imageSearch.title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.imageSearch.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.imageSearch.line2}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={imageSearchImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const FiltersTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(filtersImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.filters.filters}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.filters.line1}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={filtersImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const FavoritesTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(favoritesImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.sort.favorites}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.favorites.line1}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={favoritesImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const FavoriteGroupsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(favoriteGroupsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.help.favoriteGroups.title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.favoriteGroups.line1}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={favoriteGroupsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const CutenessTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(cutenessImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.sort.cuteness}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.cuteness.line1}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={cutenessImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const MoeTextTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(moetextImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.help.commenting.moetext.title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.moetext.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}>{i18n.help.commenting.moetext.quotes.title}</Text>
                    <Text style={styles.textAlt}>
                        {i18n.help.commenting.moetext.quotes.line1}
                    </Text>
                    <Text style={styles.textAlt}>
                        {i18n.help.commenting.moetext.quotes.line2}
                    </Text>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.highlight.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.highlight.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.bold.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.bold.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.italic.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.italic.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.underline.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.underline.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.strikethrough.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.strikethrough.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.spoiler.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.spoiler.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.link.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.link.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.dropdown.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.dropdown.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.color.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.color.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.code.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.code.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.emojis.title}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.emojis.line1}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.links.postTitle}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.links.postLine}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.text}>
                            {i18n.help.commenting.moetext.links.tagTitle}
                        </Text>
                        <Text style={styles.textAlt}>
                            {i18n.help.commenting.moetext.links.tagLine}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={moetextImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const TagGroupsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(tagGroupsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.labels.tagGroups}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.tagGroups.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.tagGroups.line2}
                    </Text>
                    <Text style={styles.textAlt}>
                        {i18n.help.tagGroups.example}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.tagGroups.line3}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={tagGroupsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const VariationsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(variationsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.sort.variations}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.variations.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.variations.line2}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.variations.line3}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={variationsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const ChildPostsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(childPostsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.post.childPosts}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.childPosts.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.childPosts.line2}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.childPosts.line3}    
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={childPostsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const GroupsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(groupsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.sort.groups}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.groups.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.groups.line2}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={groupsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const AliasesTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(aliasesImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.sort.aliases}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.aliases.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.textAlt}>
                        {i18n.help.aliases.aliasingTo.title}
                    </Text>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.aliases.line2}
                    </Text>
                </View>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={aliasesImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const ImplicationsTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(implicationsImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.labels.implications}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.implications.line1}
                </Text>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={implicationsImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const UsersTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(usersImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.help.users.title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.users.userLevels.header}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.iconColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[0]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[0]}
                        </Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.userColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[1]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[1]}
                        </Text>
                    </View> 
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.contributorColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[3]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[3]}
                        </Text>
                    </View> 
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.curatorColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[4]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[4]}
                        </Text>
                    </View> 
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.modColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[5]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[5]}
                        </Text>
                    </View> 
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.adminColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[6]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[6]}
                        </Text>
                    </View> 
                    <View style={styles.rowItem}>
                        <Text style={[styles.text, {color: colors.systemColor}]}>
                            {Object.keys(i18n.mobileHelp.users.userLevels.items)[7]}
                        </Text>
                        <Text style={styles.text}>
                            {Object.values(i18n.mobileHelp.users.userLevels.items)[7]}
                        </Text>
                    </View> 
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.textAlt}>
                        {i18n.help.users.avatars.title}
                    </Text>
                    <Text style={styles.text}>
                        {i18n.mobileHelp.users.avatars}
                    </Text>
                </View>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={usersImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const WebsiteTab: React.FunctionComponent = () => {
    const {i18n, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const {width} = useWindowDimensions()
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const updateSize = async () => {
            let targetWidth = tablet ? width - 700 : width - 50
            const size = await functions.image.normalizeWidth(websiteImg, targetWidth, width)
            setSize(size)
        }
        updateSize()
    }, [])

    return (
        <View style={[styles.container, {height: "100%"}]}>
            <View style={styles.row}>
                <Text style={styles.title}>{i18n.labels.website}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.website.line1}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>
                    {i18n.mobileHelp.website.line2}
                </Text>
            </View>
            <View style={styles.row}>
                <Link href={siteURL} style={{fontSize: 18, lineHeight: 22}}>
                    {i18n.user.visitWebsite}
                </Link>
            </View>
            <View style={styles.centerRow}>
                <Image style={size} source={websiteImg} resizeMode="contain"/>
            </View>
        </View>
    )
}

const HelpScreen: React.FunctionComponent = () => {
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet, tabBarHeight} = useLayoutSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const [index, setIndex] = useState(0)
    const {width} = useWindowDimensions()

    const renderScene = SceneMap({
        help: HelpTab,
        search: SearchTab,
        imageSearch: ImageSearchTab,
        filters: FiltersTab,
        favorites: FavoritesTab,
        favoriteGroups: FavoriteGroupsTab,
        cuteness: CutenessTab,
        moeText: MoeTextTab,
        tagGroups: TagGroupsTab,
        variations: VariationsTab,
        childPosts: ChildPostsTab,
        groups: GroupsTab,
        aliases: AliasesTab,
        implications: ImplicationsTab,
        users: UsersTab,
        website: WebsiteTab
    })

    const routes = [
        {key: "help", title: i18n.navbar.help, height: tablet ? 1450 : 1250},
        {key: "search", title: i18n.mobileHelp.search.title, height: tablet ? 2000 : 1780},
        {key: "imageSearch", title: i18n.mobileHelp.imageSearch.title, height: tablet ? 1100 : 1000},
        {key: "filters", title: i18n.filters.filters, height: tablet ? 1250 : 1050},
        {key: "favorites", title: i18n.sort.favorites, height: tablet ? 1350 : 1100},
        {key: "favoriteGroups", title: i18n.help.favoriteGroups.title, height: tablet ? 1100 : 950},
        {key: "cuteness", title: i18n.sort.cuteness, height: tablet ? 950 : 850},
        {key: "moeText", title: i18n.help.commenting.moetext.title, height: tablet ? 1050 : 960},
        {key: "tagGroups", title: i18n.labels.tagGroups, height: tablet ? 1300 : 1150},
        {key: "variations", title: i18n.sort.variations, height: tablet ? 1400 : 1320},
        {key: "childPosts", title: i18n.post.childPosts, height: tablet ? 1500 : 1450},
        {key: "groups", title: i18n.sort.groups, height: tablet ? 1100 : 1040},
        {key: "aliases", title: i18n.sort.aliases, height: tablet ? 1200 : 1100},
        {key: "implications", title: i18n.labels.implications, height: tablet ? 1000 : 900},
        {key: "users", title: i18n.help.users.title, height: tablet ? 1400 : 1200},
        {key: "website", title: i18n.labels.website, height: 720}
    ]

    const renderTabBar = (tabProps: SceneRendererProps & {navigationState: 
        NavigationState<{key: string, title: string}>}) => {
            return (
                <DefaultTabBar 
                    {...tabProps}
                    scrollEnabled={true}
                    tabStyle={{width: "auto", paddingHorizontal: 20, height: 50}}
                    indicatorContainerStyle={{backgroundColor: colors.background}}
                    style={{backgroundColor: colors.background, shadowOpacity: 0, elevation: 0}}
                    indicatorStyle={{height: 4, backgroundColor: colors.toastColor}}
                />
            )
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.navbar.help}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContainer, {height: routes[index].height, paddingBottom: tabBarHeight}]}>
                <TabView
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    initialLayout={{width}}
                    commonOptions={{
                        label: ({labelText, focused}) => {
                            return <Text style={[styles.tabLabel, 
                                focused && {color: colors.iconColor}]}>{labelText}</Text>
                        }
                    }}
                />
                <TabBar/>
            </ScrollView>
        </View>
    )
}

export default HelpScreen