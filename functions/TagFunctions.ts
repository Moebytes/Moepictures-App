/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import {TagCount, TagSearch, Tag, Session, PostFull, Post, MiniTagGroup, TagGroupCategory} from "../types/Types"
import {ThemeColors} from "../ui/colors"

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

    public static tagGroupCategories = async (post: PostFull, session: Session) => {
        let tagGroups = post.tagGroups
        let newTagGroups = [] as {name: string, tags: TagCount[]}[]
        if (!tagGroups?.length && !post.tags) {
            if ("originalID" in post) {
                let fullPost = await functions.http.get("/api/post/unverified", {postID: post.postID}, session)
                tagGroups = fullPost?.tagGroups || []
            } else {
                let fullPost = await functions.http.get("/api/post", {postID: post.postID}, session)
                tagGroups = fullPost?.tagGroups || []
            }
        }
        if (!tagGroups?.length) return []
        for (const tagGroup of tagGroups) {
            if (!tagGroup) continue
            const tagCounts = await functions.cache.sortedTagCounts(tagGroup.tags, session)
            let {tags} = await this.tagCategories(tagCounts, session)
            newTagGroups.push({name: tagGroup.name, tags})
        }
        return newTagGroups
    }

    public static parseTagGroups = (rawTags: string) => {
        const tagGroups: {name: string, tags: string[]}[] = []
        const tags: Set<string> = new Set()
        if (!rawTags) return {tagGroups, tags: []}
      
        const groupRegex = /([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g
        let match = null as RegExpExecArray | null
      
        while ((match = groupRegex.exec(rawTags)) !== null) {
          const name = match[1].trim()
          const groupTags = match[2].trim().split(/\s+/)
          tagGroups.push({name, tags: groupTags})
          groupTags.forEach(tag => tags.add(tag))
        }
      
        const remainingTags = rawTags.replace(groupRegex, "").trim().split(/\s+/)
        const soloTags = [] as string[]
        remainingTags.forEach(tag => {if (tag) {tags.add(tag); soloTags.push(tag)}})
        if (tagGroups.length && soloTags.length) tagGroups.push({name: "Tags", tags: soloTags})

        return {tagGroups, tags: Array.from(tags)}
    }

    public static parseTagGroupsField = (tags: string[], tagGroups?: MiniTagGroup[] | TagGroupCategory[]) => {
        if (!tagGroups?.length) return tags.join(" ")
        let resultStr = ""
        let removeTags = [] as string[]
        for (const tagGroup of tagGroups) {
            if (!tagGroup) continue
            if (tagGroup.name.toLowerCase() === "tags") continue
            let stringTags = tagGroup.tags.map((tag: string | TagCount) => typeof tag === "string" ? tag : tag.tag)
            resultStr += `${tagGroup.name}{${stringTags.join(" ")}}\n`
            removeTags.push(...stringTags)
        }
        let missingTags = tags.filter((tag) => !removeTags.includes(tag))
        resultStr += `${missingTags.join(" ")}`
        return resultStr
    }

    public static appendOrphanTags = (tagGroups: TagGroupCategory[], tags?: TagCount[]) => {
        if (!tags) return tagGroups
        let tagGroupTagsSet = new Set(tagGroups.flatMap((t) => t.tags.map((t) => t.tag)))
        let orphanTags = tags.filter((t) => !tagGroupTagsSet.has(t.tag))

        if (orphanTags.length) {
            let tagsGroupIndex = tagGroups.findIndex((g) => g.name === "Tags")
            if (tagsGroupIndex >= 0) {
                const existingGroup = tagGroups[tagsGroupIndex]
                const updatedGroup = {
                    ...existingGroup,
                    tags: [...existingGroup.tags, ...orphanTags]
                }
                const newTagGroups = [...tagGroups]
                newTagGroups.splice(tagsGroupIndex, 1, updatedGroup)
                return newTagGroups
            } else {
                return [...tagGroups, {name: "Tags", tags: orphanTags}]
            }
        }
        return tagGroups
    }

    public static trimSpecialCharacters = (query: string) => {
        return query?.trim().split(/ +/g).map((item) => {
            if (item.startsWith("+-")) return item.replace("+-", "")
            if (item.startsWith("+")) return item.replace("+", "")
            if (item.startsWith("-")) return item.replace("-", "")
            if (item.startsWith("*")) return item.replace("*", "")
            return item
        }).join(" ") || ""
    }

    public static getGlassColor = (tag: TagCount, colors: ThemeColors) => {
        if (tag.type === "artist") return colors.artistTagColorGlass
        if (tag.type === "character") return colors.characterTagColorGlass
        if (tag.type === "series") return colors.seriesTagColorGlass
        if (tag.type === "meta") return colors.metaTagColorGlass
        if (tag.type === "appearance") return colors.appearanceTagColorGlass
        if (tag.type === "outfit") return colors.outfitTagColorGlass
        if (tag.type === "accessory") return colors.accessoryTagColorGlass
        if (tag.type === "action") return colors.actionTagColorGlass
        if (tag.type === "scenery") return colors.sceneryTagColorGlass
        return colors.tagColorGlass
    }

    public static getTagColor = (tag: TagSearch | Tag, colors: ThemeColors) => {
        if (tag.type === "artist") return colors.artistTagColor
        if (tag.type === "character") return colors.characterTagColor
        if (tag.type === "series") return colors.seriesTagColor
        if (tag.type === "meta") return colors.metaTagColor
        if (tag.type === "appearance") return colors.appearanceTagColor
        if (tag.type === "outfit") return colors.outfitTagColor
        if (tag.type === "accessory") return colors.accessoryTagColor
        if (tag.type === "action") return colors.actionTagColor
        if (tag.type === "scenery") return colors.sceneryTagColor
        return colors.tagColor
    }

    public static getUserColor = (user: {username: string, role: string, 
        banned: boolean | null, deleted: boolean | null}, colors: ThemeColors) => {
        if (user.role === "admin") return colors.adminColor
        if (user.role === "mod") return colors.modColor
        if (user.role === "system") return colors.systemColor
        if (user.role === "premium-curator") return colors.premiumColor
        if (user.role === "curator") return colors.curatorColor
        if (user.role === "premium-contributor") return colors.premiumColor
        if (user.role === "contributor") return colors.contributorColor
        if (user.role === "premium") return colors.premiumColor
        if (user.banned) return colors.redIcon
        if (user.deleted) return colors.deletedColor
        return colors.userColor
    }
}