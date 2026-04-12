/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {closeAllDialogs} from "./layoutReducer"

const miscDialogSlice = createSlice({
    name: "miscDialog",
    initialState: {
        showPageDialog: false,
        showSavePrompt: false,
        showFullscreenImage: false,
        showCropImage: false,
        showBioDialog: false
    },
    reducers: {
        setShowPageDialog: (state, action) => {state.showPageDialog = action.payload},
        setShowSavePrompt: (state, action) => {state.showSavePrompt = action.payload},
        setShowFullscreenImage: (state, action) => {state.showFullscreenImage = action.payload},
        setShowCropImage: (state, action) => {state.showCropImage = action.payload},
        setShowBioDialog: (state, action) => {state.showBioDialog = action.payload}
    },
    extraReducers: (builder) => {
        builder.addCase(closeAllDialogs, (state) => {
            state.showPageDialog = false
            state.showBioDialog = false
        })
    }
})

const {
    setShowPageDialog, setShowSavePrompt, setShowFullscreenImage, 
    setShowCropImage, setShowBioDialog
} = miscDialogSlice.actions

export const useMiscDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showPageDialog: selector((state) => state.miscDialog.showPageDialog),
        showSavePrompt: selector((state) => state.miscDialog.showSavePrompt),
        showFullscreenImage: selector((state) => state.miscDialog.showFullscreenImage),
        showCropImage: selector((state) => state.miscDialog.showCropImage),
        showBioDialog: selector((state) => state.miscDialog.showBioDialog)
    }
}

export const useMiscDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setShowSavePrompt: (state: boolean) => dispatch(setShowSavePrompt(state)),
        setShowFullscreenImage: (state: boolean) => dispatch(setShowFullscreenImage(state)),
        setShowCropImage: (state: boolean) => dispatch(setShowCropImage(state)),
        setShowPageDialog: (state: boolean) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setShowPageDialog(state))
        },
        setShowBioDialog: (state: boolean) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setShowBioDialog(state))
        }
    }
}

export default miscDialogSlice.reducer