/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {configureStore} from "@reduxjs/toolkit"
import {api} from "./api"
import themeReducer, {useThemeSelector, useThemeActions} from "./reducers/themeReducer"
import sessionReducer, {useSessionSelector, useSessionActions} from "./reducers/sessionReducer"
import layoutReducer, {useLayoutSelector, useLayoutActions} from "./reducers/layoutReducer"
import activeReducer, {useActiveSelector, useActiveActions} from "./reducers/activeReducer"
import cacheReducer, {useCacheSelector, useCacheActions} from "./reducers/cacheReducer"
import searchReducer, {useSearchSelector, useSearchActions} from "./reducers/searchReducer"
import flagReducer, {useFlagSelector, useFlagActions} from "./reducers/flagReducer"
import filterReducer, {useFilterSelector, useFilterActions} from "./reducers/filterReducer"
import miscDialogReducer, {useMiscDialogSelector, useMiscDialogActions} from "./reducers/miscDialogReducer"
import commentDialogReducer, {useCommentDialogSelector, useCommentDialogActions} from "./reducers/commentDialogReducer"
import groupDialogReducer, {useGroupDialogSelector, useGroupDialogActions} from "./reducers/groupDialogReducer"
import postDialogReducer, {usePostDialogSelector, usePostDialogActions} from "./reducers/postDialogReducer"
import tagDialogReducer, {useTagDialogSelector, useTagDialogActions} from "./reducers/tagDialogReducer"
import searchDialogReducer, {useSearchDialogSelector, useSearchDialogActions} from "./reducers/searchDialogReducer"
import sheetReducer, {useSheetSelector, useSheetActions} from "./reducers/sheetReducer"

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        theme: themeReducer,
        session: sessionReducer,
        layout: layoutReducer,
        active: activeReducer,
        cache: cacheReducer,
        search: searchReducer,
        flag: flagReducer,
        filter: filterReducer,
        miscDialog: miscDialogReducer,
        commentDialog: commentDialogReducer,
        groupDialog: groupDialogReducer,
        postDialog: postDialogReducer,
        tagDialog: tagDialogReducer,
        searchDialog: searchDialogReducer,
        sheet: sheetReducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(api.middleware)
    }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export {
    useThemeSelector, useThemeActions,
    useSessionSelector, useSessionActions,
    useLayoutSelector, useLayoutActions,
    useActiveSelector, useActiveActions,
    useCacheSelector, useCacheActions,
    useSearchSelector, useSearchActions,
    useFlagSelector, useFlagActions,
    useFilterSelector, useFilterActions,
    useMiscDialogSelector, useMiscDialogActions,
    useCommentDialogSelector, useCommentDialogActions,
    useGroupDialogSelector, useGroupDialogActions,
    usePostDialogSelector, usePostDialogActions,
    useTagDialogSelector, useTagDialogActions,
    useSearchDialogSelector, useSearchDialogActions,
    useSheetSelector, useSheetActions
}

export default store