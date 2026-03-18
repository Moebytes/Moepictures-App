/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useThemeActions, useSessionSelector, useSessionActions} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./functions/Functions"
import {Themes} from "./types/ParamTypes"

const AsyncStorage: React.FunctionComponent = () => {
    const {setTheme} = useThemeActions()
    const {session} = useSessionSelector()
    const {setSession, setShowRelated} = useSessionActions()

    const restoreSettings = async () => {
        const savedTheme = await asyncStorage.getItem("theme")
        const savedShowRelated = await asyncStorage.getItem("showRelated")

        if (savedTheme) setTheme(savedTheme as Themes)
        if (savedShowRelated) setShowRelated(JSON.parse(savedShowRelated))
    }

    const setSessionCookie = async () => {
        const cookie = await functions.http.get("/api/user/session", null, session)
        setSession(cookie)
    }

    useEffect(() => {
        restoreSettings()
        setSessionCookie()
    }, [])

    return null
}

export default AsyncStorage