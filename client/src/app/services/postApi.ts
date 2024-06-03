import { api } from "./api"
import type { Post } from "../types"

export const postApi = api.injectEndpoints({
  endpoints: bilder => ({
    createPost: bilder.mutation<Post, { content: string }>({
      query: postData => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
    }),
    getAppPosts: bilder.query<Post[], { content: string }>({
      query: () => ({
        url: "/posts",
        method: "GET",
      }),
    }),
    getPostById: bilder.mutation<Post, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
    }),
    deletePost: bilder.mutation<void, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  usePrefetch,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAppPostsQuery,
  useGetPostByIdMutation,
  useLazyGetAppPostsQuery,
} = postApi

export const {
  endpoints: { createPost, deletePost, getAppPosts, getPostById },
} = postApi
