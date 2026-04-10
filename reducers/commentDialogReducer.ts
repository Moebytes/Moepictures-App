/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const commentDialogSlice = createSlice({
    name: "commentDialog",
    initialState: {
        editCommentID: null as string | null,
        editCommentText: ""
    },
    reducers: {
        setEditCommentID: (state, action) => {state.editCommentID = action.payload},
        setEditCommentText: (state, action) => {state.editCommentText = action.payload}
    }
})

const {
    setEditCommentID, setEditCommentText
} = commentDialogSlice.actions

export const useCommentDialogSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        editCommentID: selector((state) => state.commentDialog.editCommentID),
        editCommentText: selector((state) => state.commentDialog.editCommentText)
    }
}

export const useCommentDialogActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setEditCommentID: (state: string | null) => dispatch(setEditCommentID(state)),
        setEditCommentText: (state: string) => dispatch(setEditCommentText(state))
    }
}

export default commentDialogSlice.reducer