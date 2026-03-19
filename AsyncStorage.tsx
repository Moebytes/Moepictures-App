/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useWindowDimensions} from "react-native"
import {useThemeActions, useSessionSelector, useSessionActions, useSearchSelector, 
useSearchActions, useThemeSelector, useLayoutActions} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./functions/Functions"
import {Themes} from "./types/ParamTypes"

const AsyncStorage: React.FunctionComponent = () => {
    const {theme} = useThemeSelector()
    const {setTheme} = useThemeActions()
    const {setTablet} = useLayoutActions()
    const {session, showRelated} = useSessionSelector()
    const {setSession, setShowRelated} = useSessionActions()
    const {scroll} = useSearchSelector()
    const {setScroll} = useSearchActions()
    const {width, height} = useWindowDimensions()

    useEffect(() => {
        const isTablet = Math.min(width, height) >= 600
        setTablet(isTablet)
    }, [width, height])

    const setSessionCookie = async () => {
        const cookie = await functions.http.get("/api/user/session", null, session)
        setSession(cookie)
    }

    const restoreSettings = async () => {
        const savedTheme = await asyncStorage.getItem("theme")
        const savedShowRelated = await asyncStorage.getItem("showRelated")
        const savedScroll = await asyncStorage.getItem("scroll")

        if (savedTheme) setTheme(savedTheme as Themes)
        if (savedShowRelated) setShowRelated(Boolean(savedShowRelated))
        if (savedScroll) setScroll(Boolean(savedScroll))
    }

    useEffect(() => {
        setSessionCookie()
        restoreSettings()
    }, [])

    useEffect(() => {
        asyncStorage.setItem("theme", theme)
        asyncStorage.setItem("showRelated", String(showRelated))
    }, [theme, showRelated])

    useEffect(() => {
        asyncStorage.setItem("scroll", String(scroll))
    }, [scroll])

    return null
}

export default AsyncStorage