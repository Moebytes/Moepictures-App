/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import type {NavigationPagination} from "../components/search/useNavigationPagination"
import {createSlice} from "@reduxjs/toolkit"
import {createSelector} from "reselect"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {TagCount, TagCategories, PostSearch, PostOrdered, Post, PostHistory} from "../types/Types"

const cacheSlice = createSlice({
    name: "cache",
    initialState: {
        emojis: {} as {[key: string]: string},
        sortedTags: [] as TagCount[],
        tagCategories: null as TagCategories | null,
        navigationPagination: null as NavigationPagination | null,
        navigationGeneration: 0,
        navigationPosts: [] as PostSearch[] | PostOrdered[] | Post[] | PostHistory[]
    },
    reducers: {
        setEmojis: (state, action) => {state.emojis = action.payload},
        setSortedTags: (state, action) => {state.sortedTags = action.payload},
        setTagCategories: (state, action) => {state.tagCategories = action.payload},
        setNavigationPosts: (state, action) => {
            state.navigationPosts = action.payload.posts
            state.navigationPagination = action.payload.pagination ?? null
            state.navigationGeneration++
        },
        appendNavigationPosts: (state, action) => {
            if (state.navigationGeneration !== action.payload.generation) return
            state.navigationPosts = action.payload.posts
            state.navigationPagination = action.payload.pagination
        }
    }    
})

const {
    setEmojis, setTagCategories, setSortedTags, setNavigationPosts, appendNavigationPosts
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
        navigationPosts: selector(selectNavigationPosts),
        navigationPagination: selector((state) => state.cache.navigationPagination),
        navigationGeneration: selector((state) => state.cache.navigationGeneration)
    }
}

export const useCacheActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setEmojis: (state: {[key: string]: string}) => dispatch(setEmojis(state)),
        setSortedTags: (state: TagCount[] | null) => dispatch(setSortedTags(state)),
        setTagCategories: (state: TagCategories | null) => dispatch(setTagCategories(state)),
        setNavigationPosts: (posts: PostSearch[] | PostOrdered[] | Post[] | PostHistory[], 
            pagination?: NavigationPagination | null) => dispatch(setNavigationPosts({posts, pagination})),
        appendNavigationPosts: (posts: (Post | PostHistory)[], pagination: NavigationPagination | null, 
            generation: number) => dispatch(appendNavigationPosts({posts, pagination, generation}))
    }
}

export default cacheSlice.reducer