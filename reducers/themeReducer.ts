/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {LightTheme, DarkTheme} from "../ui/colors"
import {Themes, Languages} from "../types/Types"
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

export const useThemeSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        theme: selector((state) => state.theme.theme),
        colors: selector((state) => state.theme.theme === "dark" ? DarkTheme : LightTheme),
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