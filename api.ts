import {createApi, BaseQueryFn} from "@reduxjs/toolkit/query/react"
import functions from "./functions/Functions"
import {StoreState} from "./store"
import {GetEndpoint} from "./types/Types"

type QueryArgs = {
    url: string
    params?: unknown
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

export const api = createApi({
    reducerPath: "api",
    baseQuery: customFetch,
    endpoints: (builder) => ({
        searchPosts: builder.query<
            GetEndpoint<"/api/search/posts">["response"], 
            GetEndpoint<"/api/search/posts">["params"]
        >({
            query: (params) => ({
                url: "/api/search/posts", params
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

        searchComments: builder.query<
            GetEndpoint<"/api/search/comments">["response"], 
            GetEndpoint<"/api/search/comments">["params"]
        >({
            query: (params) => ({
                url: "/api/search/comments", params
            })
        }),

        searchNotes: builder.query<
            GetEndpoint<"/api/search/notes">["response"], 
            GetEndpoint<"/api/search/notes">["params"]
        >({
            query: (params) => ({
                url: "/api/search/notes", params
            })
        }),

        searchTags: builder.query<
            GetEndpoint<"/api/search/tags">["response"], 
            GetEndpoint<"/api/search/tags">["params"]
        >({
            query: (params) => ({
                url: "/api/search/tags", params
            })
        }),

        searchGroups: builder.query<
            GetEndpoint<"/api/search/groups">["response"], 
            GetEndpoint<"/api/search/groups">["params"]
        >({
            query: (params) => ({
                url: "/api/search/groups", params
            })
        }),

    })
})

export const {
    useSearchPostsQuery,
    useGetPostQuery,
    useSearchCommentsQuery,
    useSearchNotesQuery,
    useSearchTagsQuery,
    useSearchGroupsQuery
} = api