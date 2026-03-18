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
        privateKey: "",
        publicKey: "",
        csrfToken: "",
        showRelated: true
    },
    reducers: {
        setSession: (state, action) => {state.session = action.payload},
        setPrivateKey: (state, action) => {state.privateKey = action.payload},
        setPublicKey: (state, action) => {state.publicKey = action.payload},
        setCSRFToken: (state, action) => {state.csrfToken = action.payload},
        setShowRelated: (state, action) => {state.showRelated = action.payload}
    }    
})

const {
    setSession, setPrivateKey, setPublicKey, setCSRFToken, setShowRelated
} = sessionSlice.actions

export const useSessionSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        session: selector((state) => state.session.session),
        privateKey: selector((state) => state.session.privateKey),
        publicKey: selector((state) => state.session.publicKey),
        csrfToken: selector((state) => state.session.csrfToken),
        showRelated: selector((state) => state.session.showRelated)
    }
}

export const useSessionActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSession: (state: Session) => dispatch(setSession(state)),
        setPrivateKey: (state: string) => dispatch(setPrivateKey(state)),
        setPublicKey: (state: string) => dispatch(setPublicKey(state)),
        setCSRFToken: (state: string) => dispatch(setCSRFToken(state)),
        setShowRelated: (state: boolean) => dispatch(setShowRelated(state))
    }
}

export default sessionSlice.reducer