/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Dirs, FileSystem as fs} from "react-native-file-access"
import functions from "./Functions"
import {TagCount, Session} from "../types/Types"

export default class CacheFunctions {
    public static readCache = async <T>(key: string) => {
        const path = `${Dirs.CacheDir}/${key}.json`

        const exists = await fs.exists(path)
        if (!exists) return null

        try {
            const data = await fs.readFile(path, "utf8")
            return JSON.parse(data) as T
        } catch {
            return null
        }
    }

    public static writeCache = async (key: string, value: any) =>{
        const path = `${Dirs.CacheDir}/${key}.json`
        await fs.writeFile(path, JSON.stringify(value), "utf8")
    }

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
        const cache = await this.readCache<{[key: string]: TagCount}>("tagCounts")
        if (cache) {
            return cache
        } else {
            let tagCounts = await functions.http.get("/api/tag/counts", {tags: []}, session)
            for (const tagCount of tagCounts) {
                tagCountMap[tagCount.tag] = tagCount
            }
            this.writeCache("tagCounts", tagCountMap)
            return tagCountMap
        }
    }

    public static emojisCache = async (session: Session) => {
        const cache = await this.readCache<{[key: string]: string}>("emojis")
        if (cache) {
            return cache
        } else {
            let emojis = await functions.http.get("/api/misc/emojis", null, session)
            this.writeCache("emojis", emojis)
            return emojis
        }
    }
}