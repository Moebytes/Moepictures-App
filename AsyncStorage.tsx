/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {useWindowDimensions} from "react-native"
import Toast from "react-native-toast-message"
import {useThemeActions, useSessionSelector, useSessionActions, useSearchSelector, 
useSearchActions, useThemeSelector, useLayoutActions, useCacheActions,
useFlagActions, useFlagSelector} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./functions/Functions"
import {Languages, PostSize, PostSort, Themes} from "./types/ParamTypes"
import {siteURL} from "./ui/site"

const AsyncStorage: React.FunctionComponent = () => {
    const {i18n, theme, language, appHue, appSaturation, appLightness} = useThemeSelector()
    const {setTheme, setLanguage, setAppHue, setAppSaturation, setAppLightness} = useThemeActions()
    const {sessionFlag} = useFlagSelector()
    const {setSessionFlag} = useFlagActions()
    const {setTablet} = useLayoutActions()
    const {setSortedTags, setEmojis} = useCacheActions()
    const {session, showRelated, autosearchInterval} = useSessionSelector()
    const {setSession, setUserImg, setShowRelated, setAutosearchInterval, 
    setPrivateFavorites, setPrivateTagFavorites, setUpscaledImages, setShowR18} = useSessionActions()
    const {scroll, square, sizeType, sortType, sortReverse} = useSearchSelector()
    const {setScroll, setSquare, setSizeType, setSortType, setSortReverse} = useSearchActions()
    const {width, height} = useWindowDimensions()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const isTablet = Math.min(width, height) >= 600
        setTablet(isTablet)
    }, [width, height])

    const setSessionCookie = async () => {
        await fetch(siteURL) // Make sure that we obtain a CSRF token
        const cookie = await functions.http.get("/api/user/session", null, session)
        if (loaded && !session.username && cookie.username) {
            if (cookie.deleted) {
                await functions.http.put("/api/user/undelete", null, cookie)
                Toast.show({text1: i18n.banner.accountRestored})
                setSessionFlag(true)
            } else {
                let msg = language === "ja" ? `${functions.util.toProperCase(cookie.username)}${i18n.toast.loggedIn}` : 
                    `${i18n.toast.loggedIn}${functions.util.toProperCase(cookie.username)}`
                Toast.show({text1: msg})
            }
        }
        setSession(cookie)
    }

    const cacheEmojis = async () => {
        const emojis = await functions.cache.emojisCache(session)
        setEmojis(emojis)
    }

    const cacheSortedTags = async () => {
        const sorted = await functions.cache.sortedTagCounts("all", session)
        setSortedTags(sorted)
    }

    const updatePfp = () => {
        if (session.username) {
            let img = session.image ? functions.link.getFolderLink("pfp", session.image, session.imageHash) : 
                `${siteURL}/favicon.png`
            setUserImg(img)
        }
    }

    const syncSettings = () => {
        if (session.username) {
            setShowRelated(session.showRelated)
            setAutosearchInterval(Math.floor(session.autosearchInterval / 1000))
            setPrivateFavorites(!session.publicFavorites)
            setPrivateTagFavorites(!session.publicTagFavorites)
            setUpscaledImages(session.upscaledImages)
            setShowR18(session.showR18)
        }
    }

    const restoreSettings = async () => {
        let keys = [
            "theme",
            "appHue",
            "appSaturation",
            "appLightness",
            "language",
            "scroll",
            "showRelated",
            "autosearchInterval",
            "square", 
            "sizeType", 
            "sortType", 
            "sortReverse"
        ]

        const saved = await asyncStorage.getMany(keys)

        if (saved.theme) setTheme(saved.theme as Themes)
        if (saved.language) setLanguage(saved.language as Languages)
        if (saved.appHue) setAppHue(Number(saved.appHue))
        if (saved.appSaturation) setAppSaturation(Number(saved.appSaturation))
        if (saved.appLightness) setAppLightness(Number(saved.appLightness))
        if (saved.scroll) setScroll(saved.scroll === "true")
        if (saved.square) setSquare(saved.square === "true")
        if (saved.sizeType) setSizeType(saved.sizeType as PostSize)
        if (saved.sortType) setSortType(saved.sortType as PostSort)
        if (saved.sortReverse) setSortReverse(saved.sortReverse === "sortReverse")
        if (saved.showRelated) setShowRelated(saved.showRelated === "true")
        if (saved.autosearchInterval) setAutosearchInterval(Number(saved.autosearchInterval))

        setLoaded(true)
    }

    useEffect(() => {
        restoreSettings()
        setSessionCookie()
    }, [])

    useEffect(() => {
        updatePfp()
        syncSettings()
    }, [session])

    useEffect(() => {
        if (sessionFlag) {
            setSessionCookie()
            setSessionFlag(false)
        }
    }, [sessionFlag])

    useEffect(() => {
        if (!loaded) return
        cacheEmojis()
        cacheSortedTags()
    }, [loaded])

    useEffect(() => {
        if (!loaded) return
        asyncStorage.setItem("theme", theme)
        asyncStorage.setItem("language", language)
        asyncStorage.setItem("appHue", String(appHue))
        asyncStorage.setItem("appSaturation", String(appSaturation))
        asyncStorage.setItem("appLightness", String(appLightness))
        asyncStorage.setItem("showRelated", String(showRelated))
        asyncStorage.setItem("autosearchInterval", String(autosearchInterval))
    }, [theme, language, appHue, appSaturation, appLightness, showRelated, autosearchInterval])

    useEffect(() => {
        if (!loaded) return
        asyncStorage.setItem("scroll", String(scroll))
        asyncStorage.setItem("square", String(square))
        asyncStorage.setItem("sizeType", String(sizeType))
        asyncStorage.setItem("sortType", String(sortType))
        asyncStorage.setItem("sortReverse", String(sortReverse))
    }, [scroll, square, sizeType, sortType, sortReverse])

    return null
}

export default AsyncStorage