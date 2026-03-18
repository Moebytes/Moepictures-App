/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import asyncStorage from "@react-native-async-storage/async-storage"
import functions from "./Functions"
import {TagCount, Session} from "../types/Types"

export default class CacheFunctions {
    public static sortedTagCounts = async (tagsInput: string[] | "all", session: Session) => {
        if (!tagsInput.length) return []
        let tags = tagsInput === "all" ? [] : tagsInput
        let tagCountMap = await this.tagCountsCache(session)
        if (!tags.length) tags = Object.keys(tagCountMap)
        let result = [] as TagCount[]
        for (const tag of tags) {
            if (tagCountMap[tag]) result.push(tagCountMap[tag])
        }
        result = result.sort((a, b) => b.count > a.count ? 1 : -1)
        return result
    }

    public static tagCountsCache = async (session: Session) => {
        let tagCountMap = {} as {[key: string]: TagCount}
        const cache = await asyncStorage.getItem("tagCounts")
        if (cache) {
            return JSON.parse(cache) as {[key: string]: TagCount}
        } else {
            let tagCounts = await functions.http.get("/api/tag/counts", {tags: []}, session)
            for (const tagCount of tagCounts) {
                tagCountMap[tagCount.tag] = tagCount
            }
            asyncStorage.setItem("tagCounts", JSON.stringify(tagCountMap))
            return tagCountMap
        }
    }
}