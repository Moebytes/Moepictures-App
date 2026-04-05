/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {PostSearch, PostRating, PostStyle, Post} from "../types/Types"
import {ThemeColors} from "../ui/colors"

export default class PostFunctions {
    public static borderColor = (post: PostSearch, colors: ThemeColors) => {
        if (post.favorited) return colors.favoriteBorder
        if (post.favgrouped) return colors.favgroupBorder
        if (post.hidden) return colors.takendownBorder
        if (post.locked) return colors.lockedBorder
        if (post.hasChildren) return colors.parentBorder
        if (post.parentID) return colors.childBorder
        if (post.isGrouped) return colors.groupBorder
        if (Number(post.variationCount) > 1) return colors.variationBorder
        return colors.borderColor
    }

    public static isR18 = (ratingType: PostRating) => {
        return ratingType === "lewd" || ratingType === "all+l"
    }

    public static isSketch = (styleType: PostStyle) => {
        return styleType === "sketch" || styleType === "lineart"
    }

    public static appendIfNotExists = (post: Post, posts: Post[]) => {
        const index = posts.findIndex((p) => p.postID === post.postID)

        if (index === -1) {
            return [post, ...posts]
        } else {
            return posts
        }
    }
}