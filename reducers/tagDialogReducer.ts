/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {closeAllDialogs} from "./layoutReducer"

const tagDialogSlice = createSlice({
    name: "tagDialog",
    initialState: {
        aliasTagID: null as string | null
    },
    reducers: {
        setAliasTagID: (state, action) => {state.aliasTagID = action.payload}
    },
    extraReducers: (builder) => {
        builder.addCase(closeAllDialogs, (state) => {
            state.aliasTagID = null
        })
    }
})

const {
    setAliasTagID
} = tagDialogSlice.actions

export const useTagDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        aliasTagID: selector((state) => state.tagDialog.aliasTagID)
    }
}

export const useTagDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setAliasTagID: (state: string | null) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setAliasTagID(state))
        }
    }
}

export default tagDialogSlice.reducer