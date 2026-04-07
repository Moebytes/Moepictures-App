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
        sharingActive: false,
        statusBarVisible: true
    },
    reducers: {
        setTablet: (state, action) => {state.tablet = action.payload},
        setHeaderHeight: (state, action) => {state.headerHeight = action.payload},
        setTabBarHeight: (state, action) => {state.tabBarHeight = action.payload},
        setKeyboardOpen: (state, action) => {state.keyboardOpen = action.payload},
        setSharingActive: (state, action) => {state.sharingActive = action.payload},
        setStatusBarVisible: (state, action) => {state.statusBarVisible = action.payload}
    }    
})

const {
    setHeaderHeight, setTabBarHeight, setTablet, setKeyboardOpen, setSharingActive, setStatusBarVisible
} = layoutSlice.actions

const dialogOpen = createSelector(
    [(state: StoreState) => state.miscDialog.showPageDialog,
     (state: StoreState) => state.searchDialog.showSizeDialog,
     (state: StoreState) => state.searchDialog.showSortDialog,
    (state: StoreState) => state.searchDialog.showPageMultiplierDialog,
    (state: StoreState) => state.groupDialog.favgroupID],
    (showPageDialog, showSizeDialog, showSortDialog, showPageMultiplierDialog, favgroupID) => {
        return (
            showPageDialog || showSizeDialog || showSortDialog || 
            showPageMultiplierDialog || favgroupID
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
        statusBarVisible: selector((state) => state.layout.statusBarVisible),
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
        setStatusBarVisible: (state: boolean) => dispatch(setStatusBarVisible(state)),
        closeAllDialogs: () => dispatch(closeAllDialogs())
    }
}

export default layoutSlice.reducer