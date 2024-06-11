import { api } from "./api"

export const followApi = api.injectEndpoints({
  endpoints: build => ({
    followUser: build.mutation<void, { followingId: string }>({
      query: body => ({
        url: "/follow",
        method: "POST",
        body,
      }),
    }),
    unfollowUser: build.mutation<void, string>({
      query: id => ({
        url: `/unfollow/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { usePrefetch, useFollowUserMutation, useUnfollowUserMutation } =
  followApi

export const {
  endpoints: { followUser, unfollowUser },
} = followApi
