import { createListenerMiddleware } from "@reduxjs/toolkit"
import { login } from "../app/services/userApi"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  matcher: login.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()

    const token = action.payload.token

    if (token) {
      localStorage.setItem("token", token)
    }
  },
})
