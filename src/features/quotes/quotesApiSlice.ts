import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type Quote = {
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

export const quotesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
  reducerPath: "quotesApi",
  tagTypes: ["Quotes"],
  endpoints: build => ({
    getQuotes: build.query<QuotesApiResponse, number | undefined>({
      query: (limit = 10) => `?limit=${limit.toString()}`,
      providesTags: (_result, _error, id) => [{ type: "Quotes", id }],
    }),
  }),
})

export const { useGetQuotesQuery } = quotesApiSlice
