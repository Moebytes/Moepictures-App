/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice, createSelector, createAction} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

export const closeAllDialogs = createAction("dialogs/closeAll")

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        tablet: false,
        headerHeight: 210,
        tabBarHeight: 110,
        keyboardOpen: false
    },
    reducers: {
        setTablet: (state, action) => {state.tablet = action.payload},
        setHeaderHeight: (state, action) => {state.headerHeight = action.payload},
        setTabBarHeight: (state, action) => {state.tabBarHeight = action.payload},
        setKeyboardOpen: (state, action) => {state.keyboardOpen = action.payload}
    }    
})

const {
    setHeaderHeight, setTabBarHeight, setTablet, setKeyboardOpen
} = layoutSlice.actions

const dialogOpen = createSelector(
    [(state: StoreState) => state.miscDialog.showPageDialog,
     (state: StoreState) => state.searchDialog.showSizeDialog,
     (state: StoreState) => state.searchDialog.showSortDialog],
    (showPageDialog, showSizeDialog, showSortDialog) => {
        return (
            showPageDialog || showSizeDialog || showSortDialog
        )
    }
)

export const useLayoutSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        tablet: selector((state) => state.layout.tablet),
        headerHeight: selector((state) => state.layout.headerHeight),
        tabBarHeight: selector((state) => state.layout.tabBarHeight),
        keyboardOpen: selector((state) => state.layout.keyboardOpen),
        dialogOpen: selector(dialogOpen)
    }
}

export const useLayoutActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setTablet: (state: boolean) => dispatch(setTablet(state)),
        setHeaderHeight: (state: number) => dispatch(setHeaderHeight(state)),
        setTabBarHeight: (state: number) => dispatch(setTabBarHeight(state)),
        setKeyboardOpen: (state: boolean) => dispatch(setKeyboardOpen(state)),
        closeAllDialogs: () => dispatch(closeAllDialogs())
    }
}

export default layoutSlice.reducer