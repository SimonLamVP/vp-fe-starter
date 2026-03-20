import type { RootState } from "../../app/store"

export const selectProducts = (state: RootState) => state.product.products
export const selectSelectedProduct = (state: RootState) =>
  state.product.selectedProduct
export const selectCreatedProduct = (state: RootState) =>
  state.product.createdProduct
export const selectUpdatedProduct = (state: RootState) =>
  state.product.updatedProduct
export const selectDeletedProduct = (state: RootState) =>
  state.product.deletedProduct