/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {closeAllDialogs} from "./layoutReducer"

const searchDialogSlice = createSlice({
    name: "searchDialog",
    initialState: {
        showSizeDialog: false,
        showSortDialog: false
    },
    reducers: {
        setShowSizeDialog: (state, action) => {state.showSizeDialog = action.payload},
        setShowSortDialog: (state, action) => {state.showSortDialog = action.payload}
    },
    extraReducers: (builder) => {
        builder.addCase(closeAllDialogs, (state) => {
            state.showSizeDialog = false
            state.showSortDialog = false
        })
    }
})

const {
    setShowSizeDialog, setShowSortDialog
} = searchDialogSlice.actions

export const useSearchDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showSizeDialog: selector((state) => state.searchDialog.showSizeDialog),
        showSortDialog: selector((state) => state.searchDialog.showSortDialog)
    }
}

export const useSearchDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setShowSizeDialog: (state: boolean) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setShowSizeDialog(state))
        },
        setShowSortDialog: (state: boolean) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setShowSortDialog(state))
        }
    }    
}

export default searchDialogSlice.reducer