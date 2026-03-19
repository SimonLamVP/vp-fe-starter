import { createAsyncThunk } from "@reduxjs/toolkit"
import type {
  AddCartPayload,
  Cart,
  CartListResponse,
  DeletedCart,
  UpdateCartPayload,
} from "./cartSlice"

const CARTS_BASE_URL = "https://dummyjson.com/carts"

const CART_ERRORS = {
  list: "Failed to fetch carts",
  single: "Failed to fetch cart",
  user: "Failed to fetch user carts",
  create: "Failed to create cart",
  update: "Failed to update cart",
  delete: "Failed to delete cart",
} as const

const delay = async (ms: number): Promise<void> =>
  { await new Promise(resolve => {
    setTimeout(resolve, ms)
  }); }

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
    const carts = await parseJsonResponse<CartListResponse>(
      response,
      thunkApi,
      CART_ERRORS.list,
    )

    await delay(1000)

    return carts
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
