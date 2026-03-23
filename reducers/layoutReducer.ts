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
        keyboardOpen: false,
        sharingActive: false
    },
    reducers: {
        setTablet: (state, action) => {state.tablet = action.payload},
        setHeaderHeight: (state, action) => {state.headerHeight = action.payload},
        setTabBarHeight: (state, action) => {state.tabBarHeight = action.payload},
        setKeyboardOpen: (state, action) => {state.keyboardOpen = action.payload},
        setSharingActive: (state, action) => {state.sharingActive = action.payload}
    }    
})

const {
    setHeaderHeight, setTabBarHeight, setTablet, setKeyboardOpen, setSharingActive
} = layoutSlice.actions

const dialogOpen = createSelector(
    [(state: StoreState) => state.miscDialog.showPageDialog,
     (state: StoreState) => state.searchDialog.showSizeDialog,
     (state: StoreState) => state.searchDialog.showSortDialog,
    (state: StoreState) => state.searchDialog.showPageMultiplierDialog],
    (showPageDialog, showSizeDialog, showSortDialog, showPageMultiplierDialog) => {
        return (
            showPageDialog || showSizeDialog || 
            showSortDialog || showPageMultiplierDialog
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
        sharingActive: selector((state) => state.layout.sharingActive),
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
        setSharingActive: (state: boolean) => dispatch(setSharingActive(state)),
        closeAllDialogs: () => dispatch(closeAllDialogs())
    }
}

export default layoutSlice.reducer