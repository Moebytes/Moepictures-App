/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const sheetSlice = createSlice({
    name: "sheet",
    initialState: {
        showPostsSheet: false,
        showCommentsSheet: false,
        showNotesSheet: false,
        showTagsSheet: false,
        showGroupsSheet: false,
        showSearchHistorySheet: false,
        showTagFavoritesSheet: false,
        showSavedSearchesSheet: false
    },
    reducers: {
        setShowPostsSheet: (state, action) => {state.showPostsSheet = action.payload},
        setShowCommentsSheet: (state, action) => {state.showCommentsSheet = action.payload},
        setShowNotesSheet: (state, action) => {state.showNotesSheet = action.payload},
        setShowTagsSheet: (state, action) => {state.showTagsSheet = action.payload},
        setShowGroupsSheet: (state, action) => {state.showGroupsSheet = action.payload},
        setShowSearchHistorySheet: (state, action) => {state.showSearchHistorySheet = action.payload},
        setShowTagFavoritesSheet: (state, action) => {state.showTagFavoritesSheet = action.payload},
        setShowSavedSearchesSheet: (state, action) => {state.showSavedSearchesSheet = action.payload}
    }
})

const {
    setShowPostsSheet, setShowCommentsSheet, setShowNotesSheet, 
    setShowTagsSheet, setShowGroupsSheet, setShowSearchHistorySheet,
    setShowTagFavoritesSheet, setShowSavedSearchesSheet
} = sheetSlice.actions

export const useSheetSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showPostsSheet: selector((state) => state.sheet.showPostsSheet),
        showCommentsSheet: selector((state) => state.sheet.showCommentsSheet),
        showNotesSheet: selector((state) => state.sheet.showNotesSheet),
        showTagsSheet: selector((state) => state.sheet.showTagsSheet),
        showGroupsSheet: selector((state) => state.sheet.showGroupsSheet),
        showSearchHistorySheet: selector((state) => state.sheet.showSearchHistorySheet),
        showTagFavoritesSheet: selector((state) => state.sheet.showTagFavoritesSheet),
        showSavedSearchesSheet: selector((state) => state.sheet.showSavedSearchesSheet)
    }
}

export const useSheetActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setShowPostsSheet: (state: boolean) => dispatch(setShowPostsSheet(state)),
        setShowCommentsSheet: (state: boolean) => dispatch(setShowCommentsSheet(state)),
        setShowNotesSheet: (state: boolean) => dispatch(setShowNotesSheet(state)),
        setShowTagsSheet: (state: boolean) => dispatch(setShowTagsSheet(state)),
        setShowGroupsSheet: (state: boolean) => dispatch(setShowGroupsSheet(state)),
        setShowSearchHistorySheet: (state: boolean) => dispatch(setShowSearchHistorySheet(state)),
        setShowTagFavoritesSheet: (state: boolean) => dispatch(setShowTagFavoritesSheet(state)),
        setShowSavedSearchesSheet: (state: boolean) => dispatch(setShowSavedSearchesSheet(state))
    }
}

export default sheetSlice.reducer