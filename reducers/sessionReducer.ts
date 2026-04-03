/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {Session} from "../types/Types"

const sessionSlice = createSlice({
    name: "session",
    initialState: {
        session: {} as Session,
        userImg: "",
        showRelated: true,
        autosearchInterval: 5,
        privateFavorites: false,
        privateTagFavorites: false,
        upscaledImages: false,
        showR18: false
    },
    reducers: {
        setSession: (state, action) => {state.session = action.payload},
        setUserImg: (state, action) => {state.userImg = action.payload},
        setShowRelated: (state, action) => {state.showRelated = action.payload},
        setAutosearchInterval: (state, action) => {state.autosearchInterval = action.payload},
        setPrivateFavorites: (state, action) => {state.privateFavorites = action.payload},
        setPrivateTagFavorites: (state, action) => {state.privateTagFavorites = action.payload},
        setUpscaledImages: (state, action) => {state.upscaledImages = action.payload},
        setShowR18: (state, action) => {state.showR18 = action.payload}
    }    
})

const {
    setSession, setUserImg, setShowRelated, setAutosearchInterval, setPrivateFavorites,
    setPrivateTagFavorites, setUpscaledImages, setShowR18
} = sessionSlice.actions

export const useSessionSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        session: selector((state) => state.session.session),
        userImg: selector((state) => state.session.userImg),
        showRelated: selector((state) => state.session.showRelated),
        autosearchInterval: selector((state) => state.session.autosearchInterval),
        privateFavorites: selector((state) => state.session.privateFavorites),
        privateTagFavorites: selector((state) => state.session.privateTagFavorites),
        upscaledImages: selector((state) => state.session.upscaledImages),
        showR18: selector((state) => state.session.showR18)
    }
}

export const useSessionActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSession: (state: Session) => dispatch(setSession(state)),
        setUserImg: (state: string) => dispatch(setUserImg(state)),
        setShowRelated: (state: boolean) => dispatch(setShowRelated(state)),
        setAutosearchInterval: (state: number) => dispatch(setAutosearchInterval(state)),
        setPrivateFavorites: (state: boolean) => dispatch(setPrivateFavorites(state)),
        setPrivateTagFavorites: (state: boolean) => dispatch(setPrivateTagFavorites(state)),
        setUpscaledImages: (state: boolean) => dispatch(setUpscaledImages(state)),
        setShowR18: (state: boolean) => dispatch(setShowR18(state))
    }
}

export default sessionSlice.reducer