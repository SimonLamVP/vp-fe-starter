import { screen, waitFor } from "@testing-library/react"
import { App } from "./App"
import { renderWithProviders } from "./utils/test-utils"

const mockCartResponse = {
  carts: [
    {
      id: 1,
      userId: 99,
      total: 250,
      discountedTotal: 220,
      totalProducts: 2,
      totalQuantity: 3,
      products: [
        {
          id: 10,
          title: "Phone",
          price: 100,
          quantity: 1,
          total: 100,
          discountPercentage: 10,
          discountedTotal: 90,
        },
        {
          id: 11,
          title: "Case",
          price: 75,
          quantity: 2,
          total: 150,
          discountPercentage: 13.33,
          discountedTotal: 130,
        },
      ],
    },
  ],
  total: 1,
  skip: 0,
  limit: 10,
}

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCartResponse),
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("renders the carts view and fetches carts on load", async () => {
    renderWithProviders(<App />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/carts?limit=10",
      )
    })

    expect(
      await screen.findByText("Select the Quantity of Carts to Fetch:"),
    ).toBeInTheDocument()
    expect(screen.getByText("Cart #1")).toBeInTheDocument()
    expect(screen.getByText("Phone x 1")).toBeInTheDocument()
  })
})
