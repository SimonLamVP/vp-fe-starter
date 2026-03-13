import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

export type Quote = {
  id: number
  quote: string
  author: string
}

type QuotesApiResponse = {
  quotes: Quote[]
  total: number
  skip: number
  limit: number
}

type QuotesState = {
  quotes: Quote[]
  total: number
  skip: number
  limit: number
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: QuotesState = {
  quotes: [],
  total: 0,
  skip: 0,
  limit: 10,
  status: "idle",
  error: null,
}

export const fetchQuotes = createAsyncThunk<
  QuotesApiResponse,
  number,
  { rejectValue: string }
>("quotes/fetchQuotes", async (limit, thunkApi) => {
  try {
    const response = await fetch(
      `https://dummyjson.com/quotes?limit=${limit.toString()}`,
    )

    if (!response.ok) {
      return thunkApi.rejectWithValue("Failed to fetch quotes")
    }

    return (await response.json()) as QuotesApiResponse
  } catch {
    return thunkApi.rejectWithValue("Failed to fetch quotes")
  }
})

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchQuotes.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.quotes = action.payload.quotes
        state.total = action.payload.total
        state.skip = action.payload.skip
        state.limit = action.payload.limit
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload ?? "Failed to fetch quotes"
      })
  },
})

export const quotesReducer = quotesSlice.reducer

export const selectQuotes = (state: RootState) => state.quotes.quotes
export const selectQuotesStatus = (state: RootState) => state.quotes.status
export const selectQuotesError = (state: RootState) => state.quotes.error
