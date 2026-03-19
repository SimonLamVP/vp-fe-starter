import type { RootState } from "../../app/store"
import type { RequestStatus } from "../requestStatus/requestStatusSlice"
import { selectRequestStatus } from "../requestStatus/requestStatusSlice"
import {
  addProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "./productThunks"

export const selectFetchProductsRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, fetchProducts.typePrefix)

export const selectFetchProductByIdRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, fetchProductById.typePrefix)

export const selectAddProductRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, addProduct.typePrefix)

export const selectUpdateProductRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, updateProduct.typePrefix)

export const selectDeleteProductRequestStatus = (
  state: RootState,
): RequestStatus => selectRequestStatus(state, deleteProduct.typePrefix)
