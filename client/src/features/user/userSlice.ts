import { createSlice } from "@reduxjs/toolkit"

import { User } from "../../app/types"
import { current, getUserById, login } from "../../app/services/userApi"

interface initialState {
  user: User | null
  isAuth: boolean
  users: User[] | null
  current: User | null
  token?: string
}

const initialState: initialState = {
  user: null,
  isAuth: false,
  users: null,
  current: null,
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    logout: state => initialState,
    resetUser: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(login.matchFulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuth = true
      })
      .addMatcher(current.matchFulfilled, (state, action) => {
        console.log("current.matchFulfilled", action)
        state.current = action.payload
        state.isAuth = true
      })
      .addMatcher(getUserById.matchFulfilled, (state, action) => {
        state.current = action.payload
      })
  },
})

export const { resetUser, logout } = userSlice.actions
export const userReduces = userSlice.reducer
