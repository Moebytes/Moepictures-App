import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {LightTheme, DarkTheme} from "../ui/colors"
import {Themes} from "../types/Types"

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: "light" as Themes
    },
    reducers: {
        setTheme: (state, action) => {state.theme = action.payload}
    }    
})

const {
    setTheme
} = themeSlice.actions

export const useThemeSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        theme: selector((state) => state.theme.theme),
        colors: selector((state) => state.theme.theme === "dark" ? DarkTheme : LightTheme)
    }
}

export const useThemeActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setTheme: (state: Themes) => dispatch(setTheme(state))
    }
}

export default themeSlice.reducer