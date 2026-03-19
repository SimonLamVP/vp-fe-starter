import { createAsyncThunk } from "@reduxjs/toolkit"
import type {
  AddProductPayload,
  DeletedProduct,
  Product,
  ProductListResponse,
  UpdateProductPayload,
} from "./productSlice"

const PRODUCTS_BASE_URL = "https://dummyjson.com/products"

const PRODUCT_ERRORS = {
  list: "Failed to fetch products",
  single: "Failed to fetch product",
  create: "Failed to create product",
  update: "Failed to update product",
  delete: "Failed to delete product",
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

export const fetchProducts = createAsyncThunk<
  ProductListResponse,
  number,
  { rejectValue: string }
>("product/fetchProducts", async (limit, thunkApi) => {
  try {
    const response = await fetch(
      `${PRODUCTS_BASE_URL}?limit=${limit.toString()}`,
    )
    const products = await parseJsonResponse<ProductListResponse>(
      response,
      thunkApi,
      PRODUCT_ERRORS.list,
    )

    await delay(1000)

    return products
  } catch {
    return thunkApi.rejectWithValue(PRODUCT_ERRORS.list)
  }
})

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("product/fetchProductById", async (productId, thunkApi) => {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/${productId.toString()}`)

    return await parseJsonResponse<Product>(
      response,
      thunkApi,
      PRODUCT_ERRORS.single,
    )
  } catch {
    return thunkApi.rejectWithValue(PRODUCT_ERRORS.single)
  }
})

export const addProduct = createAsyncThunk<
  Product,
  AddProductPayload,
  { rejectValue: string }
>("product/addProduct", async (payload, thunkApi) => {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return await parseJsonResponse<Product>(
      response,
      thunkApi,
      PRODUCT_ERRORS.create,
    )
  } catch {
    return thunkApi.rejectWithValue(PRODUCT_ERRORS.create)
  }
})

export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductPayload,
  { rejectValue: string }
>("product/updateProduct", async ({ id, ...payload }, thunkApi) => {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/${id.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return await parseJsonResponse<Product>(
      response,
      thunkApi,
      PRODUCT_ERRORS.update,
    )
  } catch {
    return thunkApi.rejectWithValue(PRODUCT_ERRORS.update)
  }
})

export const deleteProduct = createAsyncThunk<
  DeletedProduct,
  number,
  { rejectValue: string }
>("product/deleteProduct", async (productId, thunkApi) => {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/${productId.toString()}`, {
      method: "DELETE",
    })

    return await parseJsonResponse<DeletedProduct>(
      response,
      thunkApi,
      PRODUCT_ERRORS.delete,
    )
  } catch {
    return thunkApi.rejectWithValue(PRODUCT_ERRORS.delete)
  }
})
