/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {configureStore} from "@reduxjs/toolkit"
import themeReducer, {useThemeSelector, useThemeActions} from "./reducers/themeReducer"

const store = configureStore({
    reducer: {
        theme: themeReducer
    }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export {
    useThemeSelector, useThemeActions
}

export default store