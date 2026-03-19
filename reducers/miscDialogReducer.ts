/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const miscDialogSlice = createSlice({
    name: "miscDialog",
    initialState: {
        showPageDialog: false
    },
    reducers: {
        setShowPageDialog: (state, action) => {state.showPageDialog = action.payload}
    }
})

const {
    setShowPageDialog
} = miscDialogSlice.actions

export const useMiscDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        showPageDialog: selector((state) => state.miscDialog.showPageDialog)
    }
}

export const useMiscDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setShowPageDialog: (state: boolean) => dispatch(setShowPageDialog(state))
    }
}

export default miscDialogSlice.reducer