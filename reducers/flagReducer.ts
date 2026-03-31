/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {PostSearch} from "../types/Types"

const flagSlice = createSlice({
    name: "flag",
    initialState: {
        pageFlag: null as number | null,
        randomSearchFlag: false,
        imageSearchFlag: null as PostSearch[] | null,
        searchScrollFlag: false
    },
    reducers: {
        setPageFlag: (state, action) => {state.pageFlag = action.payload},
        setRandomSearchFlag: (state, action) => {state.randomSearchFlag = action.payload},
        setImageSearchFlag: (state, action) => {state.imageSearchFlag = action.payload},
        setSearchScrollFlag: (state, action) => {state.searchScrollFlag = action.payload}
    }
})

const {
    setPageFlag, setRandomSearchFlag, setImageSearchFlag, setSearchScrollFlag
} = flagSlice.actions

export const useFlagSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        pageFlag: selector((state) => state.flag.pageFlag),
        randomSearchFlag: selector((state) => state.flag.randomSearchFlag),
        imageSearchFlag: selector((state) => state.flag.imageSearchFlag),
        searchScrollFlag: selector((state) => state.flag.searchScrollFlag)
    }
}

export const useFlagActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setPageFlag: (state: number | null) => dispatch(setPageFlag(state)),
        setRandomSearchFlag: (state: boolean) => dispatch(setRandomSearchFlag(state)),
        setImageSearchFlag: (state: PostSearch[] | null) => dispatch(setImageSearchFlag(state)),
        setSearchScrollFlag: (state: boolean) => dispatch(setSearchScrollFlag(state))
    }
}

export default flagSlice.reducer