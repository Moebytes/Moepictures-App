/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createApi, BaseQueryFn} from "@reduxjs/toolkit/query/react"
import functions from "./functions/Functions"
import {StoreState} from "./store"
import {GetEndpoint} from "./types/Types"

type QueryArgs = {
    url: string
    params?: unknown
}

type PageParams = {
  offset: number
  limit: number
}

const customFetch: BaseQueryFn<QueryArgs, unknown, {message: string}> = async (args, api) => {
    try {
        const state = api.getState() as StoreState
        let data = await functions.http.get(args.url as any, args.params as any, state.session.session)
        return {data}
    } catch (error: any) {
        return {error: {message: error.message}}
    }
}

const getNextPageParam = (lastPage: any, allPages: any[], 
    lastPageParam: PageParams, allPageParams: PageParams[]) => {
    const nextOffset = lastPageParam.offset + lastPageParam.limit

    if (!lastPage || lastPage.length < lastPageParam.limit) {
        return undefined
    }

    return {...lastPageParam, offset: nextOffset}
}

const getPreviousPageParam = (firstPage: any, allPages: any[], 
    firstPageParam: PageParams, allPageParams: PageParams[]) => {
    const prevOffset = firstPageParam.offset - firstPageParam.limit

    if (firstPageParam.offset <= 0) {
        return undefined
    }

    return {...firstPageParam, offset: prevOffset}
}

export const api = createApi({
    reducerPath: "api",
    baseQuery: customFetch,
    endpoints: (builder) => ({
        searchPosts: builder.infiniteQuery<
            GetEndpoint<"/api/search/posts">["response"], 
            GetEndpoint<"/api/search/posts">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 15
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/posts", params: {...queryArg, ...pageParam}
            })
        }),

        searchPostsPage: builder.query<
            GetEndpoint<"/api/search/posts">["response"], 
            GetEndpoint<"/api/search/posts">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/posts", params
            })
        }),

        searchComments: builder.infiniteQuery<
            GetEndpoint<"/api/search/comments">["response"], 
            GetEndpoint<"/api/search/comments">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 15
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/comments", params: {...queryArg, ...pageParam}
            })
        }),

        searchCommentsPage: builder.query<
            GetEndpoint<"/api/search/comments">["response"], 
            GetEndpoint<"/api/search/comments">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/comments", params
            })
        }),

        searchNotes: builder.infiniteQuery<
            GetEndpoint<"/api/search/notes">["response"], 
            GetEndpoint<"/api/search/notes">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 15
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/notes", params: {...queryArg, ...pageParam}
            })
        }),

        searchNotesPage: builder.query<
            GetEndpoint<"/api/search/notes">["response"], 
            GetEndpoint<"/api/search/notes">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/notes", params
            })
        }),

        searchTags: builder.infiniteQuery<
            GetEndpoint<"/api/search/tags">["response"], 
            GetEndpoint<"/api/search/tags">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 15
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/tags", params: {...queryArg, ...pageParam}
            })
        }),

        searchTagsPage: builder.query<
            GetEndpoint<"/api/search/tags">["response"], 
            GetEndpoint<"/api/search/tags">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/tags", params
            })
        }),

        searchGroups: builder.infiniteQuery<
            GetEndpoint<"/api/search/groups">["response"], 
            GetEndpoint<"/api/search/groups">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 15
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/groups", params: {...queryArg, ...pageParam}
            })
        }),

        searchGroupsPage: builder.query<
            GetEndpoint<"/api/search/groups">["response"], 
            GetEndpoint<"/api/search/groups">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/groups", params
            })
        }),

        getPost: builder.query<
            GetEndpoint<"/api/post">["response"], 
            GetEndpoint<"/api/post">["params"]
        >({
            query: (params) => ({
                url: "/api/post", params
            })
        })
    })
})

export const {
    useSearchPostsInfiniteQuery,
    useSearchPostsPageQuery,
    useGetPostQuery,
    useSearchCommentsInfiniteQuery,
    useSearchCommentsPageQuery,
    useSearchNotesInfiniteQuery,
    useSearchNotesPageQuery,
    useSearchTagsInfiniteQuery,
    useSearchTagsPageQuery,
    useSearchGroupsInfiniteQuery,
    useSearchGroupsPageQuery
} = api