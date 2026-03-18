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
import cacheReducer, {useCacheSelector, useCacheActions} from "./reducers/cacheReducer"

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        theme: themeReducer,
        session: sessionReducer,
        layout: layoutReducer,
        cache: cacheReducer
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
    useCacheSelector, useCacheActions
}

export default store