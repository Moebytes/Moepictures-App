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
import {Languages, Themes} from "./types/ParamTypes"

const AsyncStorage: React.FunctionComponent = () => {
    const {theme, language, appHue, appSaturation, appLightness} = useThemeSelector()
    const {setTheme, setLanguage, setAppHue, setAppSaturation, setAppLightness} = useThemeActions()
    const {setTablet} = useLayoutActions()
    const {setSortedTags} = useCacheActions()
    const {session, showRelated} = useSessionSelector()
    const {setSession, setShowRelated} = useSessionActions()
    const {scroll} = useSearchSelector()
    const {setScroll} = useSearchActions()
    const {width, height} = useWindowDimensions()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const isTablet = Math.min(width, height) >= 600
        setTablet(isTablet)
    }, [width, height])

    const setSessionCookie = async () => {
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
            "showRelated"
        ]

        const saved = await asyncStorage.getMany(keys)

        if (saved.theme) setTheme(saved.theme as Themes)
        if (saved.language) setLanguage(saved.language as Languages)
        if (saved.appHue) setAppHue(Number(saved.appHue))
        if (saved.appSaturation) setAppSaturation(Number(saved.appSaturation))
        if (saved.appLightness) setAppLightness(Number(saved.appLightness))
        if (saved.scroll) setScroll(saved.scroll === "true")
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
    }, [scroll])

    return null
}

export default AsyncStorage