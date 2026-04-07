/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {closeAllDialogs} from "./layoutReducer"

const groupDialogSlice = createSlice({
    name: "groupDialog",
    initialState: {
        favgroupID: null as string | null
    },
    reducers: {
        setFavgroupID: (state, action) => {state.favgroupID = action.payload}
    },
    extraReducers: (builder) => {
        builder.addCase(closeAllDialogs, (state) => {
            state.favgroupID = null
        })
    }
})

const {
    setFavgroupID
} = groupDialogSlice.actions

export const useGroupDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        favgroupID: selector((state) => state.groupDialog.favgroupID)
    }
}

export const useGroupDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setFavgroupID: (state: string | null) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setFavgroupID(state))
        }
    }
}

export default groupDialogSlice.reducer