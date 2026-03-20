import { createSlice } from "@reduxjs/toolkit"
import {
  addCart,
  deleteCart,
  fetchCartById,
  fetchCarts,
  fetchCartsByUserId,
  updateCart,
} from "./cartThunks"

export type CartProduct = {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountPercentage: number
  discountedTotal: number
}

export type Cart = {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

export type CartListResponse = {
  carts: Cart[]
  total: number
  skip: number
  limit: number
}

export type CartProductInput = {
  id: number
  quantity: number
}

export type AddCartPayload = {
  userId: number
  products: CartProductInput[]
}

export type UpdateCartPayload = {
  id: number
  merge?: boolean
  products: CartProductInput[]
}

export type DeletedCart = Cart & {
  isDeleted: boolean
  deletedOn: string
}

type CartState = {
  carts: Cart[]
  total: number
  skip: number
  limit: number
  selectedCart: Cart | null
  userCarts: Cart[]
  createdCart: Cart | null
  updatedCart: Cart | null
  deletedCart: DeletedCart | null
}

const initialState: CartState = {
  carts: [],
  total: 0,
  skip: 0,
  limit: 10,
  selectedCart: null,
  userCarts: [],
  createdCart: null,
  updatedCart: null,
  deletedCart: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.carts = action.payload.carts
        state.total = action.payload.total
        state.skip = action.payload.skip
        state.limit = action.payload.limit
      })
      .addCase(fetchCartById.fulfilled, (state, action) => {
        state.selectedCart = action.payload
      })
      .addCase(fetchCartsByUserId.fulfilled, (state, action) => {
        state.userCarts = action.payload.carts
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.createdCart = action.payload
        state.selectedCart = action.payload
        state.carts = [action.payload, ...state.carts]
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.updatedCart = action.payload
        state.selectedCart = action.payload
        state.carts = state.carts.map(cart =>
          cart.id === action.payload.id ? action.payload : cart,
        )
        state.userCarts = state.userCarts.map(cart =>
          cart.id === action.payload.id ? action.payload : cart,
        )
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.deletedCart = action.payload
        state.carts = state.carts.filter(cart => cart.id !== action.payload.id)
        state.userCarts = state.userCarts.filter(
          cart => cart.id !== action.payload.id,
        )

        if (state.selectedCart?.id === action.payload.id) {
          state.selectedCart = null
        }
      })
  },
})

export const cartReducer = cartSlice.reducer
