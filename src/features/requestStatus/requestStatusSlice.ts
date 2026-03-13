import { createSlice } from "@reduxjs/toolkit"
import type { UnknownAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { fetchOrders } from "../orders/ordersSlice"

export type RequestStatus = {
  status: "idle" | "loading" | "succeeded" | "failed"
  error?: string | undefined
}

type RequestStatusState = {
  requests: Record<string, RequestStatus>
}

const idleRequestStatus: RequestStatus = { status: "idle" }

const initialState: RequestStatusState = {
  requests: {
    [fetchOrders.typePrefix]: idleRequestStatus,
  },
}

const isPendingAction = (
  action: UnknownAction,
): action is UnknownAction & { type: `${string}/pending` } =>
  typeof action.type === "string" && action.type.endsWith("/pending")

const isFulfilledAction = (
  action: UnknownAction,
): action is UnknownAction & { type: `${string}/fulfilled` } =>
  typeof action.type === "string" && action.type.endsWith("/fulfilled")

const isRejectedAction = (
  action: UnknownAction,
): action is UnknownAction & { type: `${string}/rejected` } =>
  typeof action.type === "string" && action.type.endsWith("/rejected")

const getActionError = (action: UnknownAction): string | undefined => {
  if ("payload" in action && typeof action.payload === "string") {
    return action.payload
  }

  if (
    "error" in action &&
    typeof action.error === "object" &&
    action.error !== null &&
    "message" in action.error &&
    typeof action.error.message === "string"
  ) {
    return action.error.message
  }

  return undefined
}

const requestStatusSlice = createSlice({
  name: "requestStatus",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isPendingAction, (state, action) => {
        const key = action.type.replace("/pending", "")
        state.requests[key] = { status: "loading", error: undefined }
      })
      .addMatcher(isFulfilledAction, (state, action) => {
        const key = action.type.replace("/fulfilled", "")
        state.requests[key] = { status: "succeeded", error: undefined }
      })
      .addMatcher(isRejectedAction, (state, action) => {
        const key = action.type.replace("/rejected", "")
        state.requests[key] = {
          status: "failed",
          error: getActionError(action),
        }
      })
  },
})

export const requestStatusReducer = requestStatusSlice.reducer

export const selectRequestStatus = (
  state: RootState,
  key: string,
): RequestStatus => state.requestStatus.requests[key] ?? idleRequestStatus

export const selectFetchOrdersRequestStatus = (state: RootState): RequestStatus =>
  selectRequestStatus(state, fetchOrders.typePrefix)
