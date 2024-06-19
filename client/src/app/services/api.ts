import {
  createApi,
  EndpointBuilder,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:3000"
    : "http://localhost:3000"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.userReduces.token ?? localStorage.getItem("token")

    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
})
