/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"
import {PostType, PostRating, PostStyle, PostSize, PostSort, ImageFormat} from "../types/Types"

const searchSlice = createSlice({
    name: "search",
    initialState: {
        search: "",
        searchFlag: false,
        imageType: "image" as PostType,
        ratingType: "all" as PostRating,
        styleType: "all" as PostStyle,
        sizeType: "medium" as PostSize,
        sortType: "random" as PostSort,
        sortReverse: false,
        square: false,
        scroll: false,
        pageMultiplier: 1,
        format: "jpg" as ImageFormat,
        autoSearch: false,
        saveSearch: false,
        favSearch: false,
        autoScroll: false,
        showChildren: false,
        text: "",
        focused: false,
        searchTags: [] as string[]
    },
    reducers: {
        setSearch: (state, action) => {state.search = action.payload},
        setSearchFlag: (state, action) => {state.searchFlag = action.payload},
        setImageType: (state, action) => {state.imageType = action.payload},
        setRatingType: (state, action) => {state.ratingType = action.payload},
        setStyleType: (state, action) => {state.styleType = action.payload},
        setSizeType: (state, action) => {state.sizeType = action.payload},
        setSortType: (state, action) => {state.sortType = action.payload},
        setSortReverse: (state, action) => {state.sortReverse = action.payload},
        setSquare: (state, action) => {state.square = action.payload},
        setScroll: (state, action) => {state.scroll = action.payload},
        setPageMultiplier: (state, action) => {state.pageMultiplier = action.payload},
        setFormat: (state, action) => {state.format = action.payload},
        setAutoSearch: (state, action) => {state.autoSearch = action.payload},
        setSaveSearch: (state, action) => {state.saveSearch = action.payload},
        setFavSearch: (state, action) => {state.favSearch = action.payload},
        setAutoScroll: (state, action) => {state.autoScroll = action.payload},
        setShowChildren: (state, action) => {state.showChildren = action.payload},
        setText: (state, action) => {state.text = action.payload},
        setFocused: (state, action) => {state.focused = action.payload},
        setSearchTags: (state, action) => {state.searchTags = action.payload}
    }    
})

const {
    setSearch, setSearchFlag, setImageType, setRatingType, setStyleType, setSizeType,
    setSortType, setSortReverse, setSquare, setScroll, setAutoScroll, setPageMultiplier,
    setFormat, setAutoSearch, setSaveSearch, setFavSearch, setShowChildren,
    setText, setFocused, setSearchTags
} = searchSlice.actions

export const useSearchSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        search: selector((state) => state.search.search),
        searchFlag: selector((state) => state.search.searchFlag),
        imageType: selector((state) => state.search.imageType),
        ratingType: selector((state) => state.search.ratingType),
        styleType: selector((state) => state.search.styleType),
        sizeType: selector((state) => state.search.sizeType),
        sortType: selector((state) => state.search.sortType),
        sortReverse: selector((state) => state.search.sortReverse),
        square: selector((state) => state.search.square),
        scroll: selector((state) => state.search.scroll),
        pageMultiplier: selector((state) => state.search.pageMultiplier),
        format: selector((state) => state.search.format),
        autoSearch: selector((state) => state.search.autoSearch),
        saveSearch: selector((state) => state.search.saveSearch),
        favSearch: selector((state) => state.search.favSearch),
        autoScroll: selector((state) => state.search.autoScroll),
        showChildren: selector((state) => state.search.showChildren),
        text: selector((state) => state.search.text),
        focused: selector((state) => state.search.focused),
        searchTags: selector((state) => state.search.searchTags)
    }
}

export const useSearchActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSearch: (state: string) => dispatch(setSearch(state)),
        setSearchFlag: (state: boolean) => dispatch(setSearchFlag(state)),
        setImageType: (state: PostType) => dispatch(setImageType(state)),
        setRatingType: (state: PostRating) => dispatch(setRatingType(state)),
        setStyleType: (state: PostStyle) => dispatch(setStyleType(state)),
        setSizeType: (state: PostSize) => dispatch(setSizeType(state)),
        setSortType: (state: PostSort) => dispatch(setSortType(state)),
        setSortReverse: (state: boolean) => dispatch(setSortReverse(state)),
        setSquare: (state: boolean) => dispatch(setSquare(state)),
        setScroll: (state: boolean) => dispatch(setScroll(state)),
        setPageMultiplier: (state: number) => dispatch(setPageMultiplier(state)),
        setFormat: (state: ImageFormat) => dispatch(setFormat(state)),
        setAutoSearch: (state: boolean) => dispatch(setAutoSearch(state)),
        setSaveSearch: (state: boolean) => dispatch(setSaveSearch(state)),
        setFavSearch: (state: boolean) => dispatch(setFavSearch(state)),
        setAutoScroll: (state: boolean) => dispatch(setAutoScroll(state)),
        setShowChildren: (state: boolean) => dispatch(setShowChildren(state)),
        setText: (state: string) => dispatch(setText(state)),
        setFocused: (state: boolean) => dispatch(setFocused(state)),
        setSearchTags: (state: string[]) => dispatch(setSearchTags(state))
    }
}

export default searchSlice.reducer