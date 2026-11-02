/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {useRef} from "react"
import store, {useCacheSelector, useCacheActions, useSearchSelector, useSessionSelector} from "../../store"
import functions from "../../functions/Functions"
import type {GetEndpoint, Post, PostHistory} from "../../types/Types"

type NavigationEndpoint = 
    | "/api/search/posts" 
    | "/api/search/comments" 
    | "/api/search/notes" 
    | "/api/user/history" 
    | "/api/user/uploads" 
    | "/api/user/favorites"

export type NavigationPagination = {
    [Endpoint in NavigationEndpoint]: {
        endpoint: Endpoint
        params: GetEndpoint<Endpoint>["params"]
        offset: number
        limit: number
    }
}[NavigationEndpoint]

export const nextNavigationOffset = (pageParams: {offset: number, limit: number}[] | undefined) => {
    const last = pageParams?.[pageParams.length - 1]
    return last ? last.offset + last.limit : 16
}

const navigationPageFinished = (rows: unknown[], pagination: NavigationPagination) => {
    const first = rows[0] as {[key: string]: unknown} | undefined
    const count = first?.postCount ?? first?.commentCount ?? first?.noteCount ?? first?.historyCount
    return rows.length < pagination.limit || (count !== undefined && pagination.offset + rows.length >= Number(count))
}

const appendNavigationPage = (posts: (Post | PostHistory)[], next: Post[]) => {
    const seen = new Set(posts.map((post) => String(post.postID)))
    return [...posts, ...next.filter((post) => {
        if (seen.has(String(post.postID))) return false
        seen.add(String(post.postID))
        return true
    })]
}

export const useNavigationPagination = (enabled: boolean) => {
    const {navigationPosts, navigationPagination, navigationGeneration} = useCacheSelector()
    const {appendNavigationPosts} = useCacheActions()
    const {ratingType} = useSearchSelector()
    const {session} = useSessionSelector()
    const fetching = useRef(false)

    const loadMore = async () => {
        if (!enabled || !navigationPagination || fetching.current) return
        fetching.current = true
        let pagination: NavigationPagination | null = navigationPagination
        let posts = navigationPosts as (Post | PostHistory)[]

        const isCurrent = () => {
            const state = store.getState()
            return state.cache.navigationGeneration === navigationGeneration &&
                state.cache.navigationPagination === navigationPagination && 
                state.miscDialog.showFullscreenImage
        }

        try {
            while (pagination && isCurrent()) {
                const rows: (Post | {post: Post})[] = await functions.http.get(pagination.endpoint,
                    {...pagination.params, offset: pagination.offset, limit: pagination.limit}, session)
                if (!isCurrent()) return
                
                const nextPosts = rows.map((row) => "post" in row ? row.post : row) as Post[]
                const filtered = functions.post.filterPosts(nextPosts, ratingType, session)

                const appended = appendNavigationPage(posts, filtered)
                const hasNewImages = appended.slice(posts.length).some((post) => post.images.length > 0)
                posts = appended
                pagination = navigationPageFinished(rows, pagination) ? null :
                    {...pagination, offset: pagination.offset + pagination.limit}

                if (hasNewImages || !pagination) {
                    return appendNavigationPosts(posts, pagination, navigationGeneration)
                }
            }
        } finally {
            fetching.current = false
        }
    }

    return {loadMore}
}
