/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {createSelector} from "reselect"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {TagCount, TagCategories, PostSearch, PostOrdered, Post} from "../types/Types"

const cacheSlice = createSlice({
    name: "cache",
    initialState: {
        emojis: {} as {[key: string]: string},
        sortedTags: [] as TagCount[],
        tagCategories: null as TagCategories | null,
        navigationPosts: [] as PostSearch[] | PostOrdered[] | Post[]
    },
    reducers: {
        setEmojis: (state, action) => {state.emojis = action.payload},
        setSortedTags: (state, action) => {state.sortedTags = action.payload},
        setTagCategories: (state, action) => {state.tagCategories = action.payload},
        setNavigationPosts: (state, action) => {state.navigationPosts = action.payload}
    }    
})

const {
    setEmojis, setTagCategories, setSortedTags, setNavigationPosts
} = cacheSlice.actions

const selectEmojis = createSelector((state: StoreState) => state.cache, (cache) => cache.emojis)
const selectSortedTags = createSelector((state: StoreState) => state.cache, (cache) => cache.sortedTags)
const selectTagCategories = createSelector((state: StoreState) => state.cache, (cache) => cache.tagCategories)
const selectNavigationPosts = createSelector((state: StoreState) => state.cache, (cache) => cache.navigationPosts)

export const useCacheSelector = () => {
    const selector = useSelector.withTypes<StoreState>()

    return {
        emojis: selector(selectEmojis),
        sortedTags: selector(selectSortedTags),
        tagCategories: selector(selectTagCategories),
        navigationPosts: selector(selectNavigationPosts)
    }
}

export const useCacheActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setEmojis: (state: {[key: string]: string}) => dispatch(setEmojis(state)),
        setSortedTags: (state: TagCount[] | null) => dispatch(setSortedTags(state)),
        setTagCategories: (state: TagCategories | null) => dispatch(setTagCategories(state)),
        setNavigationPosts: (state: PostSearch[] | PostOrdered[] | Post[]) => dispatch(setNavigationPosts(state))
    }
}

export default cacheSlice.reducer