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
}

const initialState: QuotesState = {
  quotes: [],
  total: 0,
  skip: 0,
  limit: 10,
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
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
        state.quotes = action.payload.quotes
        state.total = action.payload.total
        state.skip = action.payload.skip
        state.limit = action.payload.limit
      })
  },
})

export const quotesReducer = quotesSlice.reducer

export const selectQuotes = (state: RootState) => state.quotes.quotes
