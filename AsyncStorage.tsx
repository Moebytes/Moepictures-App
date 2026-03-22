/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {useWindowDimensions} from "react-native"
import {useThemeActions, useSessionSelector, useSessionActions, useSearchSelector, 
useSearchActions, useThemeSelector, useLayoutActions, useCacheActions} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./functions/Functions"
import {Languages, PostSize, PostSort, Themes} from "./types/ParamTypes"

const AsyncStorage: React.FunctionComponent = () => {
    const {theme, language, appHue, appSaturation, appLightness} = useThemeSelector()
    const {setTheme, setLanguage, setAppHue, setAppSaturation, setAppLightness} = useThemeActions()
    const {setTablet} = useLayoutActions()
    const {setSortedTags} = useCacheActions()
    const {session, showRelated} = useSessionSelector()
    const {setSession, setShowRelated} = useSessionActions()
    const {scroll, square, sizeType, sortType, sortReverse} = useSearchSelector()
    const {setScroll, setSquare, setSizeType, setSortType, setSortReverse} = useSearchActions()
    const {width, height} = useWindowDimensions()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const isTablet = Math.min(width, height) >= 600
        setTablet(isTablet)
    }, [width, height])

    const setSessionCookie = async () => {
        await fetch("https://moepictures.net") // Make sure that we obtain a CSRF token
        const cookie = await functions.http.get("/api/user/session", null, session)
        setSession(cookie)
    }

    const updateCache = async () => {
        const sorted = await functions.cache.sortedTagCounts("all", session)
        setSortedTags(sorted)
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

        setLoaded(true)
    }

    useEffect(() => {
        restoreSettings()
        setSessionCookie()
    }, [])

    useEffect(() => {
        if (!loaded) return
        updateCache()
    }, [loaded])

    useEffect(() => {
        if (!loaded) return
        asyncStorage.setItem("theme", theme)
        asyncStorage.setItem("language", language)
        asyncStorage.setItem("showRelated", String(showRelated))
        asyncStorage.setItem("appHue", String(appHue))
        asyncStorage.setItem("appSaturation", String(appSaturation))
        asyncStorage.setItem("appLightness", String(appLightness))
    }, [theme, language, appHue, appSaturation, appLightness, showRelated])

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