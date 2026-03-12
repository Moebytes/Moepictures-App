/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {Session} from "../types/Types"

const sessionSlice = createSlice({
    name: "session",
    initialState: {
        session: {} as Session,
        showRelated: true
    },
    reducers: {
        setSession: (state, action) => {state.session = action.payload},
        setShowRelated: (state, action) => {state.showRelated = action.payload}
    }    
})

const {setSession, setShowRelated} = sessionSlice.actions

export const useSessionSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        session: selector((state) => state.session.session),
        showRelated: selector((state) => state.session.showRelated)
    }
}

export const useSessionActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSession: (state: Session) => dispatch(setSession(state)),
        setShowRelated: (state: boolean) => dispatch(setShowRelated(state))
    }
}

export default sessionSlice.reducer