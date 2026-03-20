import { createSlice } from "@reduxjs/toolkit"
import {
  addProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "./productThunks"

export type ProductDimensions = {
  width: number
  height: number
  depth: number
}

export type ProductReview = {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export type ProductMeta = {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string | undefined
  sku: string
  weight: number
  dimensions: ProductDimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: ProductMeta
  thumbnail: string
  images: string[]
}

export type ProductListResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type AddProductPayload = {
  title: string
  description?: string
  category?: string
  price?: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
}

export type UpdateProductPayload = {
  id: number
  title?: string
  description?: string
  category?: string
  price?: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
}

export type DeletedProduct = Product & {
  isDeleted: boolean
  deletedOn: string
}

type ProductState = {
  products: Product[]
  total: number
  skip: number
  limit: number
  selectedProduct: Product | null
  createdProduct: Product | null
  updatedProduct: Product | null
  deletedProduct: DeletedProduct | null
}

const initialState: ProductState = {
  products: [],
  total: 0,
  skip: 0,
  limit: 10,
  selectedProduct: null,
  createdProduct: null,
  updatedProduct: null,
  deletedProduct: null,
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products
        state.total = action.payload.total
        state.skip = action.payload.skip
        state.limit = action.payload.limit
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.createdProduct = action.payload
        state.selectedProduct = action.payload
        state.products = [action.payload, ...state.products]
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updatedProduct = action.payload
        state.selectedProduct = action.payload
        state.products = state.products.map(product =>
          product.id === action.payload.id ? action.payload : product,
        )
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deletedProduct = action.payload
        state.products = state.products.filter(
          product => product.id !== action.payload.id,
        )

        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = null
        }
      })
  },
})

export const productReducer = productSlice.reducer
