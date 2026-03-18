/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import {TagCount, Tag, Session, PostFull, Post} from "../types/Types"

export default class TagFunctions {
    public static parseTags = async (posts: PostFull[], session: Session, isBanner?: boolean) => {
        if (!posts.length) return []
        let taggedPosts = posts.filter((p) => p.hasOwnProperty("tags")) as PostFull[] 
        if (!taggedPosts.length) {
            taggedPosts = await functions.http.get("/api/posts", 
            {postIDs: posts.map((p: Post) => p.postID).slice(0, 20)}, session)
        }
        let uniqueTags = new Set<string>()
        for (let i = 0; i < taggedPosts.length; i++) {
            for (let j = 0; j < taggedPosts[i].tags.length; j++) {
                uniqueTags.add(taggedPosts[i].tags[j])
            }
        }
        const uniqueTagArray = Array.from(uniqueTags)
        let result = await functions.cache.sortedTagCounts(uniqueTagArray.slice(0, 300), session)
        for (let i = 0; i < uniqueTagArray.length; i++) {
            const found = result.find((r: any) => r.tag === uniqueTagArray[i])
            if (!found) result.push({tag: uniqueTagArray[i], count: "0", type: "tag", 
                image: "", imageHash: "", hidden: false, r18: false, social: "", twitter: "",
                website: "", fandom: "", wikipedia: ""})
        }
        let characterTags = result.filter((t: any) => t.type === "character")
        let seriesTags = result.filter((t: any) => t.type === "series")
        return isBanner ? [...seriesTags, ...characterTags] : result
    }

    public static tagCategories = async (parsedTags: string[] | TagCount[] | Tag[] | undefined, session: Session) => {
        let artists = [] as TagCount[]
        let characters = [] as TagCount[]
        let series = [] as TagCount[]
        let meta = [] as TagCount[]
        let tags = [] as TagCount[] 
        if (!parsedTags) return {artists, characters, series, meta, tags}
        let tagMap = await functions.cache.tagCountsCache(session)
        for (let i = 0; i < parsedTags.length; i++) {
            let tag = parsedTags[i].hasOwnProperty("tag") ? (parsedTags[i] as TagCount).tag : parsedTags[i] as string
            let count = parsedTags[i].hasOwnProperty("count") ? (parsedTags[i] as TagCount).count : 0
            const foundTag = tagMap[tag]
            if (foundTag) {
                const obj = {} as TagCount 
                obj.tag = tag
                obj.count = String(count)
                obj.type = foundTag.type
                obj.image = foundTag.image
                obj.imageHash = foundTag.imageHash
                obj.social = foundTag.social
                obj.twitter = foundTag.twitter
                obj.website = foundTag.website
                obj.fandom = foundTag.fandom
                obj.wikipedia = foundTag.wikipedia
                if (foundTag.type === "artist") {
                    artists.push(obj)
                } else if (foundTag.type === "character") {
                    characters.push(obj)
                } else if (foundTag.type === "series") {
                    series.push(obj)
                } else if (foundTag.type === "meta") {
                    meta.push(obj)
                } else {
                    tags.push(obj)
                }
            }
        }
        return {artists, characters, series, meta, tags}
    }
}