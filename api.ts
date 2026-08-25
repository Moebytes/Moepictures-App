/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


import {createApi, BaseQueryFn} from "@reduxjs/toolkit/query/react"
import {useDispatch} from "react-redux"
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
    
    let countKeys = ["tagCount", "groupCount", "commentCount", 
        "noteCount", "historyCount", "requestCount", "postCount"]
    const countKey = countKeys.find((key) => lastPage[0]?.[key] !== undefined)

    const total = Number(countKey ? lastPage[0][countKey] : lastPage.length)

    if (!lastPage || total < lastPageParam.limit) {
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
    tagTypes: ["Post", "Tags", "Tag", "Groups", "Group", "Favgroups", "Favgroup"],
    endpoints: (builder) => ({
        searchPosts: builder.infiniteQuery<
            GetEndpoint<"/api/search/posts">["response"], 
            GetEndpoint<"/api/search/posts">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
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
                    limit: 16
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
                    limit: 16
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
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/tags", params: {...queryArg, ...pageParam}
            }),
            providesTags: (result, error, arg) => [
                {type: "Tags"}
            ]
        }),

        searchTagsPage: builder.query<
            GetEndpoint<"/api/search/tags">["response"], 
            GetEndpoint<"/api/search/tags">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/tags", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Tags"}
            ]
        }),

        searchGroups: builder.infiniteQuery<
            GetEndpoint<"/api/search/groups">["response"], 
            GetEndpoint<"/api/search/groups">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/search/groups", params: {...queryArg, ...pageParam}
            }),
            providesTags: (result, error, arg) => [
                {type: "Groups"}
            ]
        }),

        searchGroupsPage: builder.query<
            GetEndpoint<"/api/search/groups">["response"], 
            GetEndpoint<"/api/search/groups">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/search/groups", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Groups"}
            ]
        }),

        searchHistory: builder.infiniteQuery<
            GetEndpoint<"/api/user/history">["response"], 
            GetEndpoint<"/api/user/history">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
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

        postHistory: builder.infiniteQuery<
            GetEndpoint<"/api/post/history">["response"], 
            GetEndpoint<"/api/post/history">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/post/history", params: {...queryArg, ...pageParam}
            })
        }),

        postHistoryPage: builder.query<
            GetEndpoint<"/api/post/history">["response"], 
            GetEndpoint<"/api/post/history">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/post/history", params
            })
        }),

        tagHistory: builder.infiniteQuery<
            GetEndpoint<"/api/tag/history">["response"], 
            GetEndpoint<"/api/tag/history">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/tag/history", params: {...queryArg, ...pageParam}
            })
        }),

        tagHistoryPage: builder.query<
            GetEndpoint<"/api/tag/history">["response"], 
            GetEndpoint<"/api/tag/history">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/tag/history", params
            })
        }),

        groupHistory: builder.infiniteQuery<
            GetEndpoint<"/api/group/history">["response"], 
            GetEndpoint<"/api/group/history">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/group/history", params: {...queryArg, ...pageParam}
            })
        }),

        groupHistoryPage: builder.query<
            GetEndpoint<"/api/group/history">["response"], 
            GetEndpoint<"/api/group/history">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/group/history", params
            })
        }),

        getPost: builder.query<
            GetEndpoint<"/api/post">["response"], 
            GetEndpoint<"/api/post">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/post", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Post", id: arg.postID}
            ]
        }),

        getPostParent: builder.query<
            GetEndpoint<"/api/post/parent">["response"], 
            GetEndpoint<"/api/post/parent">["params"]
        >({
            query: (params) => ({
                url: "/api/post/parent", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Post", id: arg.postID}
            ]
        }),

        getPostChildren: builder.query<
            GetEndpoint<"/api/post/children">["response"], 
            GetEndpoint<"/api/post/children">["params"]
        >({
            query: (params) => ({
                url: "/api/post/children", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Post", id: arg.postID}
            ]
        }),

        getPostGroups: builder.query<
            GetEndpoint<"/api/groups">["response"], 
            GetEndpoint<"/api/groups">["params"]
        >({
            query: (params) => ({
                url: "/api/groups", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Post", id: arg.postID}
            ]
        }),

        getPostHistory: builder.query<
            GetEndpoint<"/api/post/history">["response"], 
            GetEndpoint<"/api/post/history">["params"]
        >({
            query: (params) => ({
                url: "/api/post/history", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Post", id: arg?.postID}
            ]
        }),

        getComments: builder.query<
            GetEndpoint<"/api/post/comments">["response"], 
            GetEndpoint<"/api/post/comments">["params"]
        >({
            query: (params) => ({
                url: "/api/post/comments", params
            }),
            keepUnusedDataFor: 0
        }),

        getTag: builder.query<
            GetEndpoint<"/api/tag">["response"], 
            GetEndpoint<"/api/tag">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/tag", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Tag", id: arg.tag}
            ]
        }),

        getTagHistory: builder.query<
            GetEndpoint<"/api/tag/history">["response"], 
            GetEndpoint<"/api/tag/history">["params"]
        >({
            query: (params) => ({
                url: "/api/tag/history", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Tag", id: arg?.tag}
            ]
        }),

        getGroup: builder.query<
            GetEndpoint<"/api/group">["response"], 
            GetEndpoint<"/api/group">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/group", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Group", id: arg.name}
            ]
        }),

        getGroupHistory: builder.query<
            GetEndpoint<"/api/group/history">["response"], 
            GetEndpoint<"/api/group/history">["params"]
        >({
            query: (params) => ({
                url: "/api/group/history", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Group", id: arg?.slug}
            ]
        }),

        getFavgroups: builder.query<
            GetEndpoint<"/api/user/favgroups">["response"], 
            GetEndpoint<"/api/user/favgroups">["params"]
        >({
            query: (params) => ({
                url: "/api/user/favgroups", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Favgroups"}
            ]
        }),

        getFavgroup: builder.query<
            GetEndpoint<"/api/favgroup">["response"], 
            GetEndpoint<"/api/favgroup">["params"]
        >({
            query: (params) => ({
                url: "/api/favgroup", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Favgroup", id: arg.name}
            ]
        }),

        getUser: builder.query<
            GetEndpoint<"/api/user">["response"], 
            GetEndpoint<"/api/user">["params"]
        >({
            query: (params) => ({
                url: "/api/user", params
            })
        }),

        getUploads: builder.infiniteQuery<
            GetEndpoint<"/api/user/uploads">["response"], 
            GetEndpoint<"/api/user/uploads">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/user/uploads", params: {...queryArg, ...pageParam}
            })
        }),


        getFavorites: builder.infiniteQuery<
            GetEndpoint<"/api/user/favorites">["response"], 
            GetEndpoint<"/api/user/favorites">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/user/favorites", params: {...queryArg, ...pageParam}
            })
        }),

        getFavoriteTags: builder.query<
            GetEndpoint<"/api/tagfavorites">["response"], 
            GetEndpoint<"/api/tagfavorites">["params"]
        >({
            query: (params) => ({
                url: "/api/tagfavorites", params
            })
        }),

        getFavoriteGroups: builder.query<
            GetEndpoint<"/api/user/favgroups">["response"], 
            GetEndpoint<"/api/user/favgroups">["params"]
        >({
            query: (params) => ({
                url: "/api/user/favgroups", params
            }),
            providesTags: (result, error, arg) => [
                {type: "Favgroups"}
            ]
        }),

        getUserComments: builder.infiniteQuery<
            GetEndpoint<"/api/user/comments">["response"], 
            GetEndpoint<"/api/user/comments">["params"] & {refreshKey?: number},
            PageParams
        >({
            infiniteQueryOptions: {
                initialPageParam: {
                    offset: 0,
                    limit: 16
                },
                getNextPageParam,
                getPreviousPageParam
            },
            query: ({queryArg, pageParam}) => ({
                url: "/api/user/comments", params: {...queryArg, ...pageParam}
            })
        }),

        getUserCommentsPage: builder.query<
            GetEndpoint<"/api/user/comments">["response"], 
            GetEndpoint<"/api/user/comments">["params"] & {refreshKey?: number}
        >({
            query: (params) => ({
                url: "/api/user/comments", params
            })
        }),
    })
})

export const useInvalidatePost = () => {
  const dispatch = useDispatch()

  return (postID: string) => {
    dispatch(api.util.invalidateTags([{type: "Post", id: postID}]))
  }
}

export const useInvalidateTags = () => {
  const dispatch = useDispatch()

  return () => {
    dispatch(api.util.invalidateTags([{type: "Tags"}]))
  }
}

export const useInvalidateTag = () => {
  const dispatch = useDispatch()

  return (tag: string) => {
    dispatch(api.util.invalidateTags([{type: "Tag", id: tag}]))
  }
}

export const useInvalidateGroups = () => {
  const dispatch = useDispatch()

  return () => {
    dispatch(api.util.invalidateTags([{type: "Groups"}]))
  }
}

export const useInvalidateGroup = () => {
  const dispatch = useDispatch()

  return (slug: string) => {
    dispatch( api.util.invalidateTags([{type: "Group", id: slug}]))
  }
}

export const useInvalidateFavgroups = () => {
  const dispatch = useDispatch()

  return () => {
    dispatch(
      api.util.invalidateTags([{type: "Favgroups"}])
    )
  }
}

export const useInvalidateFavgroup = () => {
  const dispatch = useDispatch()

  return (slug: string) => {
    dispatch(
      api.util.invalidateTags([{type: "Favgroup", id: slug}])
    )
  }
}

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
    usePostHistoryInfiniteQuery,
    usePostHistoryPageQuery,
    useTagHistoryInfiniteQuery,
    useTagHistoryPageQuery,
    useGroupHistoryInfiniteQuery,
    useGroupHistoryPageQuery,
    useGetPostQuery,
    useGetPostParentQuery,
    useGetPostChildrenQuery,
    useGetPostGroupsQuery,
    useGetPostHistoryQuery,
    useGetCommentsQuery,
    useGetTagQuery,
    useGetTagHistoryQuery,
    useGetGroupQuery,
    useGetGroupHistoryQuery,
    useGetFavgroupsQuery,
    useGetFavgroupQuery,
    useGetUserQuery,
    useGetUploadsInfiniteQuery,
    useGetFavoritesInfiniteQuery,
    useGetFavoriteTagsQuery,
    useGetFavoriteGroupsQuery,
    useGetUserCommentsInfiniteQuery,
    useGetUserCommentsPageQuery
} = api