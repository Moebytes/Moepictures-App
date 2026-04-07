/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import CommentsSheet from "./CommentsSheet"
import GroupsSheet from "./GroupsSheet"
import NotesSheet from "./NotesSheet"
import PostsSheet from "./PostsSheet"
import SavedSearchesSheet from "./SavedSearchesSheet"
import SearchHistorySheet from "./SearchHistorySheet"
import TagsSheet from "./TagsSheet"
import TagFavoritesSheet from "./TagFavoritesSheet"

const Sheets: React.FunctionComponent = () => {
    return (
        <>
        <CommentsSheet/>
        <GroupsSheet/>
        <NotesSheet/>
        <PostsSheet/>
        <SavedSearchesSheet/>
        <SearchHistorySheet/>
        <TagsSheet/>
        <TagFavoritesSheet/>
        </>
    )
}

export default Sheets