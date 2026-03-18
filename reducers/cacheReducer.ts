/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {createSelector} from "reselect"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {TagCategories} from "../types/Types"

const cacheSlice = createSlice({
    name: "cache",
    initialState: {
        tagCategories: null as TagCategories | null
    },
    reducers: {
        setTagCategories: (state, action) => {state.tagCategories = action.payload}
    }    
})

const {
    setTagCategories
} = cacheSlice.actions

const selectTagCategories = createSelector((state: StoreState) => state.cache, (cache) => cache.tagCategories)

export const useCacheSelector = () => {
    const selector = useSelector.withTypes<StoreState>()

    return {
        tagCategories: selector(selectTagCategories)
    }
}

export const useCacheActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setTagCategories: (state: TagCategories | null) => dispatch(setTagCategories(state))
    }
}

export default cacheSlice.reducer