import type { RootState } from "../../app/store"
import type { RequestStatus } from "../requestStatus/requestStatusSlice"
import { selectRequestStatus } from "../requestStatus/requestStatusSlice"
import {
  addCart,
  deleteCart,
  fetchCartById,
  fetchCarts,
  fetchCartsByUserId,
  updateCart,
} from "./cartThunks"

export const selectFetchCartsRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, fetchCarts.typePrefix)

export const selectFetchCartByIdRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, fetchCartById.typePrefix)

export const selectFetchCartsByUserIdRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, fetchCartsByUserId.typePrefix)

export const selectAddCartRequestStatus = (state: RootState): RequestStatus =>
  selectRequestStatus(state, addCart.typePrefix)

export const selectUpdateCartRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, updateCart.typePrefix)

export const selectDeleteCartRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, deleteCart.typePrefix)
