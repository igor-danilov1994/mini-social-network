import { api } from "./api"
import type { Comment } from "../types"

export const commentsApi = api.injectEndpoints({
  endpoints: build => ({
    createComment: build.mutation<Comment, {content: string, postId: string}>({
      query: newComment => ({
        url: "/comments",
        method: "POST",
        body: newComment,
      }),
    }),
    deleteComment: build.mutation<void, string>({
      query: id => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  usePrefetch,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi

export const {
  endpoints: { createComment, deleteComment },
} = commentsApi
