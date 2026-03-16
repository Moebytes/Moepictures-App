/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        headerHeight: 210,
        tabBarHeight: 110
    },
    reducers: {
        setHeaderHeight: (state, action) => {state.headerHeight = action.payload},
        setTabBarHeight: (state, action) => {state.tabBarHeight = action.payload}
    }    
})

const {
    setHeaderHeight, setTabBarHeight
} = layoutSlice.actions

export const useLayoutSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        headerHeight: selector((state) => state.layout.headerHeight),
        tabBarHeight: selector((state) => state.layout.tabBarHeight),
    }
}

export const useLayoutActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setHeaderHeight: (state: number) => dispatch(setHeaderHeight(state)),
        setTabBarHeight: (state: number) => dispatch(setTabBarHeight(state))
    }
}

export default layoutSlice.reducer