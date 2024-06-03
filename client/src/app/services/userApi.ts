import { api } from "./api"
import type { User } from "../types"

type Mutation = {
  token: string
}

interface PayloadLogin {
  email: string
  password: string
}

interface PayloadRegistration extends PayloadLogin {
  name: string
}

interface PayloadUpdateUser {
  userData: FormData
  id: string
}

const userApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<Mutation, PayloadLogin>({
      query: userData => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),
    register: build.mutation<PayloadRegistration, PayloadRegistration>({
      query: userData => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    current: build.query<User, void>({
      query: () => ({
        url: "/current",
        method: "GET",
      }),
    }),
    getUserById: build.query<User, string>({
      query: id => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
    updateUser: build.mutation<User, PayloadUpdateUser>({
      query: ({ userData, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
    }),
  }),
})

export const {
  useCurrentQuery,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useLazyCurrentQuery,
  usePrefetch,
  useLazyGetUserByIdQuery,
} = userApi

export const {
  endpoints: { login, register, current, getUserById, updateUser },
} = userApi
