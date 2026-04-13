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
useFlagActions, useFlagSelector, useFilterSelector, useFilterActions} from "./store"
import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./functions/Functions"
import {Languages, PostRating, PostSize, PostSort, PostStyle, PostType, Themes} from "./types/ParamTypes"
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
    const {scroll, square, imageType, ratingType, styleType, 
        showChildren, sizeType, sortType, sortReverse} = useSearchSelector()
    const {setScroll, setSquare, setImageType, setRatingType, setStyleType, 
        setShowChildren, setSizeType, setSortType, setSortReverse} = useSearchActions()
    const {brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate} = useFilterSelector()
    const {setBrightness, setContrast, setHue, setSaturation, 
        setLightness, setBlur, setSharpen, setPixelate} = useFilterActions()
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
            "square",
            "showRelated",
            "autosearchInterval",
            "imageType",
            "ratingType",
            "styleType",
            "showChildren",
            "sizeType",
            "sortType",
            "sortReverse",
            "brightness",
            "contrast",
            "hue",
            "saturation",
            "lightness",
            "blur",
            "sharpen",
            "pixelate"
        ]

        const saved = await asyncStorage.getMany(keys)

        if (saved.theme) setTheme(saved.theme as Themes)
        if (saved.language) setLanguage(saved.language as Languages)
        if (saved.appHue) setAppHue(Number(saved.appHue))
        if (saved.appSaturation) setAppSaturation(Number(saved.appSaturation))
        if (saved.appLightness) setAppLightness(Number(saved.appLightness))
        if (saved.scroll) setScroll(saved.scroll === "true")
        if (saved.square) setSquare(saved.square === "true")
        if (saved.imageType) setImageType(saved.imageType as PostType)
        if (saved.ratingType) setRatingType(saved.ratingType as PostRating)
        if (saved.styleType) setStyleType(saved.styleType as PostStyle)
        if (saved.showChildren) setShowChildren(saved.showChildren  === "true")
        if (saved.sizeType) setSizeType(saved.sizeType as PostSize)
        if (saved.sortType) setSortType(saved.sortType as PostSort)
        if (saved.sortReverse) setSortReverse(saved.sortReverse === "sortReverse")
        if (saved.showRelated) setShowRelated(saved.showRelated === "true")
        if (saved.autosearchInterval) setAutosearchInterval(Number(saved.autosearchInterval))
        if (saved.brightness) setBrightness(Number(saved.brightness))
        if (saved.contrast) setContrast(Number(saved.contrast))
        if (saved.hue) setHue(Number(saved.hue))
        if (saved.saturation) setSaturation(Number(saved.saturation))
        if (saved.lightness) setLightness(Number(saved.lightness))
        if (saved.blur) setBlur(Number(saved.blur))
        if (saved.sharpen) setSharpen(Number(saved.sharpen))
        if (saved.pixelate) setPixelate(Number(saved.pixelate))

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
        asyncStorage.setItem("imageType", String(imageType))
        asyncStorage.setItem("ratingType", String(ratingType))
        asyncStorage.setItem("styleType", String(styleType))
        asyncStorage.setItem("showChildren", String(showChildren))
        asyncStorage.setItem("sizeType", String(sizeType))
        asyncStorage.setItem("sortType", String(sortType))
        asyncStorage.setItem("sortReverse", String(sortReverse))
    }, [scroll, square, imageType, ratingType, styleType, 
        showChildren, sizeType, sortType, sortReverse])

    
    useEffect(() => {
        if (!loaded) return
        asyncStorage.setItem("brightness", String(brightness))
        asyncStorage.setItem("contrast", String(contrast))
        asyncStorage.setItem("hue", String(hue))
        asyncStorage.setItem("saturation", String(saturation))
        asyncStorage.setItem("lightness", String(lightness))
        asyncStorage.setItem("blur", String(blur))
        asyncStorage.setItem("sharpen", String(sharpen))
        asyncStorage.setItem("pixelate", String(pixelate))
    }, [brightness, contrast, hue, saturation, 
        lightness, blur, sharpen, pixelate])

    return null
}

export default AsyncStorage