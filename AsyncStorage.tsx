/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useThemeActions, useSessionActions} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import {Themes} from "./types/ParamTypes"

const AsyncStorage: React.FunctionComponent = () => {
    const {setTheme} = useThemeActions()
    const {setShowRelated} = useSessionActions()

    const restoreSettings = async () => {
            const savedTheme = await asyncStorage.getItem("theme")
            const savedShowRelated = await asyncStorage.getItem("showRelated")

            if (savedTheme) setTheme(savedTheme as Themes)
            if (savedShowRelated) setShowRelated(JSON.parse(savedShowRelated))
    }

    useEffect(() => {
        restoreSettings()
    }, [])

    return null
}

export default AsyncStorage