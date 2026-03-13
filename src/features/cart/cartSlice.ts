import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

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

const CARTS_BASE_URL = "https://dummyjson.com/carts"

const CART_ERRORS = {
  list: "Failed to fetch carts",
  single: "Failed to fetch cart",
  user: "Failed to fetch user carts",
  create: "Failed to create cart",
  update: "Failed to update cart",
  delete: "Failed to delete cart",
} as const

const parseJsonResponse = async <T>(
  response: Response,
  thunkApi: { rejectWithValue: (value: string) => unknown },
  errorMessage: string,
): Promise<T> => {
  if (!response.ok) {
    throw thunkApi.rejectWithValue(errorMessage)
  }

  return (await response.json()) as T
}

export const fetchCarts = createAsyncThunk<
  CartListResponse,
  number,
  { rejectValue: string }
>("cart/fetchCarts", async (limit, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}?limit=${limit.toString()}`)

    return await parseJsonResponse<CartListResponse>(
      response,
      thunkApi,
      CART_ERRORS.list,
    )
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.list)
  }
})

export const fetchCartById = createAsyncThunk<
  Cart,
  number,
  { rejectValue: string }
>("cart/fetchCartById", async (cartId, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/${cartId.toString()}`)

    return await parseJsonResponse<Cart>(response, thunkApi, CART_ERRORS.single)
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.single)
  }
})

export const fetchCartsByUserId = createAsyncThunk<
  CartListResponse,
  number,
  { rejectValue: string }
>("cart/fetchCartsByUserId", async (userId, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/user/${userId.toString()}`)

    return await parseJsonResponse<CartListResponse>(
      response,
      thunkApi,
      CART_ERRORS.user,
    )
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.user)
  }
})

export const addCart = createAsyncThunk<
  Cart,
  AddCartPayload,
  { rejectValue: string }
>("cart/addCart", async (payload, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return await parseJsonResponse<Cart>(response, thunkApi, CART_ERRORS.create)
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.create)
  }
})

export const updateCart = createAsyncThunk<
  Cart,
  UpdateCartPayload,
  { rejectValue: string }
>("cart/updateCart", async ({ id, ...payload }, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/${id.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return await parseJsonResponse<Cart>(response, thunkApi, CART_ERRORS.update)
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.update)
  }
})

export const deleteCart = createAsyncThunk<
  DeletedCart,
  number,
  { rejectValue: string }
>("cart/deleteCart", async (cartId, thunkApi) => {
  try {
    const response = await fetch(`${CARTS_BASE_URL}/${cartId.toString()}`, {
      method: "DELETE",
    })

    return await parseJsonResponse<DeletedCart>(
      response,
      thunkApi,
      CART_ERRORS.delete,
    )
  } catch {
    return thunkApi.rejectWithValue(CART_ERRORS.delete)
  }
})

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

export const selectCarts = (state: RootState) => state.cart.carts
export const selectSelectedCart = (state: RootState) => state.cart.selectedCart
export const selectUserCarts = (state: RootState) => state.cart.userCarts
export const selectCreatedCart = (state: RootState) => state.cart.createdCart
export const selectUpdatedCart = (state: RootState) => state.cart.updatedCart
export const selectDeletedCart = (state: RootState) => state.cart.deletedCart
