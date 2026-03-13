import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

export type OrderItem = {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountPercentage: number
  discountedTotal: number
}

export type Order = {
  id: number
  products: OrderItem[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

type OrdersApiResponse = {
  carts: Order[]
  total: number
  skip: number
  limit: number
}

type OrdersState = {
  orders: Order[]
  total: number
  skip: number
  limit: number
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  skip: 0,
  limit: 10,
}

export const fetchOrders = createAsyncThunk<
  OrdersApiResponse,
  number,
  { rejectValue: string }
>("orders/fetchOrders", async (limit, thunkApi) => {
  try {
    const response = await fetch(
      `https://dummyjson.com/carts?limit=${limit.toString()}`,
    )

    if (!response.ok) {
      return thunkApi.rejectWithValue("Failed to fetch orders")
    }

    return (await response.json()) as OrdersApiResponse
  } catch {
    return thunkApi.rejectWithValue("Failed to fetch orders")
  }
})

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload.carts
      state.total = action.payload.total
      state.skip = action.payload.skip
      state.limit = action.payload.limit
    })
  },
})

export const ordersReducer = ordersSlice.reducer

export const selectOrders = (state: RootState) => state.orders.orders
