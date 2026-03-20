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

const mockProductResponse = {
  products: [
    {
      id: 1,
      title: "Essence Mascara Lash Princess",
      description: "A volumizing mascara for dramatic lashes.",
      category: "beauty",
      price: 9.99,
      discountPercentage: 7.17,
      rating: 4.94,
      stock: 5,
      tags: ["beauty", "mascara"],
      brand: "Essence",
      sku: "RCH45Q1A",
      weight: 2,
      dimensions: {
        width: 23.17,
        height: 14.43,
        depth: 28.01,
      },
      warrantyInformation: "1 month warranty",
      shippingInformation: "Ships in 1 month",
      availabilityStatus: "Low Stock",
      reviews: [],
      returnPolicy: "30 days return policy",
      minimumOrderQuantity: 24,
      meta: {
        createdAt: "2024-05-23T08:56:21.618Z",
        updatedAt: "2024-05-23T08:56:21.618Z",
        barcode: "9164035109868",
        qrCode: "qr-code",
      },
      thumbnail: "thumbnail.png",
      images: ["image-1.png"],
    },
  ],
  total: 1,
  skip: 0,
  limit: 10,
}

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (input: string | URL | Request) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url

        if (url === "https://dummyjson.com/carts?limit=10") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCartResponse),
          } as Response)
        }

        if (url === "https://dummyjson.com/products?limit=10") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockProductResponse),
          } as Response)
        }

        return Promise.reject(new Error(`Unhandled fetch URL: ${url}`))
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("renders the carts and products views and fetches data on load", async () => {
    renderWithProviders(<App />)

    expect(screen.getAllByRole("status")).toHaveLength(2)

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/carts?limit=10",
      )
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products?limit=10",
      )
    })

    expect(
      await screen.findByText("Select the Quantity of Carts to Fetch:"),
    ).toBeInTheDocument()
    expect(
      await screen.findByText("Select the Quantity of Products to Fetch:"),
    ).toBeInTheDocument()
    expect(screen.getByText("Cart #1")).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => element?.textContent === "Phonex 1"),
    ).toBeInTheDocument()
    expect(screen.getByText("Essence Mascara Lash Princess")).toBeInTheDocument()
    expect(screen.getByText("Tags: beauty, mascara")).toBeInTheDocument()
  })
})
