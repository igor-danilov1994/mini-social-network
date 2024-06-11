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
    getAllPosts: bilder.query<Post[], void>({
      query: () => ({
        url: "/posts",
        method: "GET",
      }),
    }),
    getPostById: bilder.query<Post, string>({
      query: id => ({
        url: `/post/${id}`,
        method: "GET",
      }),
    }),
    deletePost: bilder.mutation<void, string>({
      query: id => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  usePrefetch,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} = postApi

export const {
  endpoints: { createPost, deletePost, getAllPosts, getPostById },
} = postApi
