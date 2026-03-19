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
    const {theme, language} = useThemeSelector()
    const {setTheme, setLanguage} = useThemeActions()
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
        const savedTheme = await asyncStorage.getItem("theme")
        const savedLanguage = await asyncStorage.getItem("language")
        const savedShowRelated = await asyncStorage.getItem("showRelated")
        const savedScroll = await asyncStorage.getItem("scroll")

        if (savedTheme) setTheme(savedTheme as Themes)
        if (savedLanguage) setLanguage(savedLanguage as Languages)
        if (savedShowRelated) setShowRelated(savedShowRelated === "true")
        if (savedScroll) setScroll(savedScroll === "true")

        setLoaded(true)
    }

    useEffect(() => {
        setSessionCookie()
        restoreSettings()
        updateCache()
    }, [])

    useEffect(() => {
        if (!loaded) return
        
        asyncStorage.setItem("theme", theme)
        asyncStorage.setItem("language", language)
        asyncStorage.setItem("showRelated", String(showRelated))
    }, [theme, language, showRelated])

    useEffect(() => {
        if (!loaded) return

        asyncStorage.setItem("scroll", String(scroll))
    }, [scroll])

    return null
}

export default AsyncStorage