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
        favgroupID: null as string | null,
        groupPostID: null as string | null
    },
    reducers: {
        setFavgroupID: (state, action) => {state.favgroupID = action.payload},
        setGroupPostID: (state, action) => {state.groupPostID = action.payload}
    },
    extraReducers: (builder) => {
        builder.addCase(closeAllDialogs, (state) => {
            state.favgroupID = null
            state.groupPostID = null
        })
    }
})

const {
    setFavgroupID, setGroupPostID
} = groupDialogSlice.actions

export const useGroupDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        favgroupID: selector((state) => state.groupDialog.favgroupID),
        groupPostID: selector((state) => state.groupDialog.groupPostID)
    }
}

export const useGroupDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setFavgroupID: (state: string | null) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setFavgroupID(state))
        },
        setGroupPostID: (state: string | null) => {
            if (state) dispatch(closeAllDialogs())
            dispatch(setGroupPostID(state))
        }
    }
}

export default groupDialogSlice.reducer