import {
  createApi,
  EndpointBuilder,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"

const BASEURL =
  process.env.NODE_ENV === "production" ? "none" : "http://localhost:3000"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASEURL}/api`,
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
