/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {Favgroup} from "../types/Types"

const activeSlice = createSlice({
    name: "active",
    initialState: {
        activeFavgroup: null as Favgroup | null,
        quoteText: "",
        firstLoad: false
    },
    reducers: {
        setActiveFavgroup: (state, action) => {state.activeFavgroup = action.payload},
        setQuoteText: (state, action) => {state.quoteText = action.payload},
        setFirstLoad: (state, action) => {state.firstLoad = action.payload}
    }    
})

const {
    setActiveFavgroup, setQuoteText, setFirstLoad
} = activeSlice.actions

export const useActiveSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        activeFavgroup: selector((state) => state.active.activeFavgroup),
        quoteText: selector((state) => state.active.quoteText),
        firstLoad: selector((state) => state.active.firstLoad)
    }
}

export const useActiveActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setActiveFavgroup: (state: Favgroup | null) => dispatch(setActiveFavgroup(state)),
        setQuoteText: (state: string) => dispatch(setQuoteText(state)),
        setFirstLoad: (state: boolean) => dispatch(setFirstLoad(state))
    }
}

export default activeSlice.reducer