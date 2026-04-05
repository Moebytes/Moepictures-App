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
        return {data: data ?? null}
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

        searchHistory: builder.infiniteQuery<
            GetEndpoint<"/api/user/history">["response"], 
            GetEndpoint<"/api/user/history">["params"] & {refreshKey?: number},
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
                url: "/api/user/history", params: {...queryArg, ...pageParam}
            })
        }),

        searchHistoryPage: builder.query<
            GetEndpoint<"/api/user/history">["response"], 
            GetEndpoint<"/api/user/history">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/user/history", params
            })
        }),

        getPost: builder.query<
            GetEndpoint<"/api/post">["response"], 
            GetEndpoint<"/api/post">["params"]
        >({
            query: (params) => ({
                url: "/api/post", params
            })
        }),

        getPostParent: builder.query<
            GetEndpoint<"/api/post/parent">["response"], 
            GetEndpoint<"/api/post/parent">["params"]
        >({
            query: (params) => ({
                url: "/api/post/parent", params
            })
        }),

        getPostChildren: builder.query<
            GetEndpoint<"/api/post/children">["response"], 
            GetEndpoint<"/api/post/children">["params"]
        >({
            query: (params) => ({
                url: "/api/post/children", params
            })
        }),

        getPostGroups: builder.query<
            GetEndpoint<"/api/groups">["response"], 
            GetEndpoint<"/api/groups">["params"]
        >({
            query: (params) => ({
                url: "/api/groups", params
            })
        }),

        getTag: builder.query<
            GetEndpoint<"/api/tag">["response"], 
            GetEndpoint<"/api/tag">["params"]
        >({
            query: (params) => ({
                url: "/api/tag", params
            })
        }),

        getGroup: builder.query<
            GetEndpoint<"/api/group">["response"], 
            GetEndpoint<"/api/group">["params"]
        >({
            query: (params) => ({
                url: "/api/group", params
            })
        }),
    })
})

export const {
    useSearchPostsInfiniteQuery,
    useSearchPostsPageQuery,
    useSearchCommentsInfiniteQuery,
    useSearchCommentsPageQuery,
    useSearchNotesInfiniteQuery,
    useSearchNotesPageQuery,
    useSearchTagsInfiniteQuery,
    useSearchTagsPageQuery,
    useSearchGroupsInfiniteQuery,
    useSearchGroupsPageQuery,
    useSearchHistoryInfiniteQuery,
    useSearchHistoryPageQuery,
    useGetPostQuery,
    useGetPostParentQuery,
    useGetPostChildrenQuery,
    useGetPostGroupsQuery,
    useGetTagQuery,
    useGetGroupQuery
} = api