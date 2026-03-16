/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {configureStore} from "@reduxjs/toolkit"
import themeReducer, {useThemeSelector, useThemeActions} from "./reducers/themeReducer"
import sessionReducer, {useSessionSelector, useSessionActions} from "./reducers/sessionReducer"
import layoutReducer, {useLayoutSelector, useLayoutActions} from "./reducers/layoutReducer"

const store = configureStore({
    reducer: {
        theme: themeReducer,
        session: sessionReducer,
        layout: layoutReducer
    }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export {
    useThemeSelector, useThemeActions,
    useSessionSelector, useSessionActions,
    useLayoutSelector, useLayoutActions
}

export default store