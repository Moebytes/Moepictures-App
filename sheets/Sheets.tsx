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
import TagsSheet from "./TagsSheet"

const Sheets: React.FunctionComponent = () => {
    return (
        <>
        <CommentsSheet/>
        <GroupsSheet/>
        <NotesSheet/>
        <PostsSheet/>
        <TagsSheet/>
        </>
    )
}

export default Sheets