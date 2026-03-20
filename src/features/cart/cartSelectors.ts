import type { RootState } from "../../app/store"

export const selectCarts = (state: RootState) => state.cart.carts
export const selectSelectedCart = (state: RootState) => state.cart.selectedCart
export const selectUserCarts = (state: RootState) => state.cart.userCarts
export const selectCreatedCart = (state: RootState) => state.cart.createdCart
export const selectUpdatedCart = (state: RootState) => state.cart.updatedCart
export const selectDeletedCart = (state: RootState) => state.cart.deletedCart