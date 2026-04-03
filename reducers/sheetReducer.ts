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
        showSearchHistorySheet: false
    },
    reducers: {
        setShowPostsSheet: (state, action) => {state.showPostsSheet = action.payload},
        setShowCommentsSheet: (state, action) => {state.showCommentsSheet = action.payload},
        setShowNotesSheet: (state, action) => {state.showNotesSheet = action.payload},
        setShowTagsSheet: (state, action) => {state.showTagsSheet = action.payload},
        setShowGroupsSheet: (state, action) => {state.showGroupsSheet = action.payload},
        setShowSearchHistorySheet: (state, action) => {state.showSearchHistorySheet = action.payload}
    }
})

const {
    setShowPostsSheet, setShowCommentsSheet, setShowNotesSheet, 
    setShowTagsSheet, setShowGroupsSheet, setShowSearchHistorySheet
} = sheetSlice.actions

export const useSheetSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showPostsSheet: selector((state) => state.sheet.showPostsSheet),
        showCommentsSheet: selector((state) => state.sheet.showCommentsSheet),
        showNotesSheet: selector((state) => state.sheet.showNotesSheet),
        showTagsSheet: selector((state) => state.sheet.showTagsSheet),
        showGroupsSheet: selector((state) => state.sheet.showGroupsSheet),
        showSearchHistorySheet: selector((state) => state.sheet.showSearchHistorySheet)
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
        setShowSearchHistorySheet: (state: boolean) => dispatch(setShowSearchHistorySheet(state))
    }
}

export default sheetSlice.reducer