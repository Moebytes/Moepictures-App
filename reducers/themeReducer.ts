/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {createSelector} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {LightTheme, DarkTheme, noRotation} from "../ui/colors"
import {Themes, Languages} from "../types/Types"
import functions from "../functions/Functions"
import en from "../assets/locales/en.json"
import ja from "../assets/locales/ja.json"

const translations: Record<string, typeof en> = {en, ja: ja as any}

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: "light" as Themes,
        language: "en" as Languages,
        appHue: 180,
        appSaturation: 100,
        appLightness: 50
    },
    reducers: {
        setTheme: (state, action) => {state.theme = action.payload},
        setLanguage: (state, action) => {state.language = action.payload},
        setAppHue: (state, action) => {state.appHue = action.payload},
        setAppSaturation: (state, action) => {state.appSaturation = action.payload},
        setAppLightness: (state, action) => {state.appLightness = action.payload},
    }
})

const {
    setTheme, setLanguage, setAppHue, setAppSaturation, setAppLightness
} = themeSlice.actions

const rotateColors = createSelector(
    [(state: StoreState) => state.theme.theme,
     (state: StoreState) => state.theme.appHue,
     (state: StoreState) => state.theme.appSaturation,
     (state: StoreState) => state.theme.appLightness],
    (theme, appHue, appSaturation, appLightness) => {
        const colorList = theme === "dark" ? DarkTheme : LightTheme

        const newColorList = {} as typeof colorList

        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i] as keyof typeof colorList
            const color = colorList[key]

            if (key in noRotation) {
                newColorList[key] = color
            } else {
                const rotated = functions.color.rotateColor(color, appHue, appSaturation, appLightness)
                newColorList[key] = rotated
            }
        }

        return newColorList
    }
)

export const useThemeSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        theme: selector((state) => state.theme.theme),
        colors: selector(rotateColors),
        i18n: translations[selector((state) => state.theme.language)],
        language: selector((state) => state.theme.language),
        appHue: selector((state) => state.theme.appHue),
        appSaturation: selector((state) => state.theme.appSaturation),
        appLightness: selector((state) => state.theme.appLightness)
    }
}

export const useThemeActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setTheme: (state: Themes) => dispatch(setTheme(state)),
        setLanguage: (state: Languages) => dispatch(setLanguage(state)),
        setAppHue: (state: number) => dispatch(setAppHue(state)),
        setAppSaturation: (state: number) => dispatch(setAppSaturation(state)),
        setAppLightness: (state: number) => dispatch(setAppLightness(state))
    }
}

export default themeSlice.reducer