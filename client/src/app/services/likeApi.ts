import { api } from "./api"
import type { Like } from "../types"

export const likesApi = api.injectEndpoints({
  endpoints: build => ({
    likePost: build.mutation<Like, { postId: string }>({
      query: body => ({
        url: "/likes",
        method: "POST",
        body,
      }),
    }),
    unlikePost: build.mutation<void, string>({
      query: id => ({
        url: `/likes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { usePrefetch, useLikePostMutation, useUnlikePostMutation } =
  likesApi

export const {
  endpoints: { likePost, unlikePost },
} = likesApi
