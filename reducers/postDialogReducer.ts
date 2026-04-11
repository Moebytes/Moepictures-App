/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {PostFull} from "../types/Types"

const postDialogSlice = createSlice({
    name: "postDialog",
    initialState: {
        childPostObj: null as PostFull | null
    },
    reducers: {
        setChildPostObj: (state, action) => {state.childPostObj = action.payload}
    }
})

const {
    setChildPostObj
} = postDialogSlice.actions

export const usePostDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        childPostObj: selector((state) => state.postDialog.childPostObj)
    }
}

export const usePostDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setChildPostObj: (state: PostFull | null) => dispatch(setChildPostObj(state))
    }    
}

export default postDialogSlice.reducer