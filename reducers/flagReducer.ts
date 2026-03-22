/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const flagSlice = createSlice({
    name: "flag",
    initialState: {
        pageFlag: null as number | null,
        randomSearchFlag: false,
        imageSearchFlag: false
    },
    reducers: {
        setPageFlag: (state, action) => {state.pageFlag = action.payload},
        setRandomSearchFlag: (state, action) => {state.randomSearchFlag = action.payload},
        setImageSearchFlag: (state, action) => {state.imageSearchFlag = action.payload}
    }
})

const {
    setPageFlag, setRandomSearchFlag, setImageSearchFlag
} = flagSlice.actions

export const useFlagSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        pageFlag: selector((state) => state.flag.pageFlag),
        randomSearchFlag: selector((state) => state.flag.randomSearchFlag),
        imageSearchFlag: selector((state) => state.flag.imageSearchFlag)
    }
}

export const useFlagActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setPageFlag: (state: number | null) => dispatch(setPageFlag(state)),
        setRandomSearchFlag: (state: boolean) => dispatch(setRandomSearchFlag(state)),
        setImageSearchFlag: (state: boolean) => dispatch(setImageSearchFlag(state))
    }
}

export default flagSlice.reducer