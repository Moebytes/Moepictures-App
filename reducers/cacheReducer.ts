/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {createSelector} from "reselect"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {TagCount, TagCategories} from "../types/Types"

const cacheSlice = createSlice({
    name: "cache",
    initialState: {
        sortedTags: [] as TagCount[],
        tagCategories: null as TagCategories | null
    },
    reducers: {
        setSortedTags: (state, action) => {state.sortedTags = action.payload},
        setTagCategories: (state, action) => {state.tagCategories = action.payload}
    }    
})

const {
    setTagCategories, setSortedTags
} = cacheSlice.actions

const selectSortedTags = createSelector((state: StoreState) => state.cache, (cache) => cache.sortedTags)
const selectTagCategories = createSelector((state: StoreState) => state.cache, (cache) => cache.tagCategories)

export const useCacheSelector = () => {
    const selector = useSelector.withTypes<StoreState>()

    return {
        sortedTags: selector(selectSortedTags),
        tagCategories: selector(selectTagCategories)
    }
}

export const useCacheActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSortedTags: (state: TagCount[] | null) => dispatch(setSortedTags(state)),
        setTagCategories: (state: TagCategories | null) => dispatch(setTagCategories(state))
    }
}

export default cacheSlice.reducer