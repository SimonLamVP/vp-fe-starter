import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { cartReducer } from "../features/cart/cartSlice"
import { productReducer } from "../features/products/productSlice"
import { requestStatusReducer } from "../features/requestStatus/requestStatusSlice"

const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  requestStatus: requestStatusReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
