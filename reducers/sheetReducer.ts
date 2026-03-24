/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {closeAllDialogs} from "./layoutReducer"

const sheetSlice = createSlice({
    name: "sheet",
    initialState: {
        showPostsSheet: false
    },
    reducers: {
        setShowPostsSheet: (state, action) => {state.showPostsSheet = action.payload}
    }
})

const {
    setShowPostsSheet
} = sheetSlice.actions

export const useSheetSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showPostsSheet: selector((state) => state.sheet.showPostsSheet)
    }
}

export const useSheetActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setShowPostsSheet: (state: boolean) => dispatch(setShowPostsSheet(state))
    }
}

export default sheetSlice.reducer