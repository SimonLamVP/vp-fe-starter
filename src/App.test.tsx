import { act, screen } from "@testing-library/react"
import { App } from "./App"
import { renderWithProviders } from "./utils/test-utils"

test("App should have correct initial render", () => {
  renderWithProviders(<App />)

  const countLabel = screen.getByLabelText<HTMLLabelElement>("Count")

  const incrementValueInput = screen.getByLabelText<HTMLInputElement>(
    "Set increment amount",
  )

  expect(screen.getByText(/learn/i)).toBeInTheDocument()

  expect(countLabel).toHaveTextContent("0")
  expect(incrementValueInput).toHaveValue(2)
})

test("Increment value and Decrement value should work as expected", async () => {
  const { user } = renderWithProviders(<App />)

  const countLabel = screen.getByLabelText<HTMLLabelElement>("Count")

  const incrementValueButton =
    screen.getByLabelText<HTMLButtonElement>("Increment value")

  const decrementValueButton =
    screen.getByLabelText<HTMLButtonElement>("Decrement value")

  await user.click(incrementValueButton)
  expect(countLabel).toHaveTextContent("1")

  await user.click(decrementValueButton)
  expect(countLabel).toHaveTextContent("0")
})

test("Add Amount should work as expected", async () => {
  const { user } = renderWithProviders(<App />)

  const countLabel = screen.getByLabelText<HTMLLabelElement>("Count")

  const incrementValueInput = screen.getByLabelText<HTMLInputElement>(
    "Set increment amount",
  )

  const addAmountButton = screen.getByText<HTMLButtonElement>("Add Amount")

  await user.click(addAmountButton)
  expect(countLabel).toHaveTextContent("2")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "2")
  await user.click(addAmountButton)
  expect(countLabel).toHaveTextContent("4")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "-1")
  await user.click(addAmountButton)
  expect(countLabel).toHaveTextContent("3")
})

it("Add Async should work as expected", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })

  const { user } = renderWithProviders(<App />)

  const addAsyncButton = screen.getByText<HTMLButtonElement>("Add Async")

  const countLabel = screen.getByLabelText<HTMLLabelElement>("Count")

  const incrementValueInput = screen.getByLabelText<HTMLInputElement>(
    "Set increment amount",
  )

  await user.click(addAsyncButton)

  await act(async () => {
    await vi.advanceTimersByTimeAsync(500)
  })

  expect(countLabel).toHaveTextContent("2")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "2")

  await user.click(addAsyncButton)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500)
  })

  expect(countLabel).toHaveTextContent("4")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "-1")
  await user.click(addAsyncButton)

  await act(async () => {
    await vi.advanceTimersByTimeAsync(500)
  })

  expect(countLabel).toHaveTextContent("3")

  vi.useRealTimers()
})

test("Add If Odd should work as expected", async () => {
  const { user } = renderWithProviders(<App />)

  const countLabel = screen.getByLabelText<HTMLLabelElement>("Count")

  const addIfOddButton = screen.getByText<HTMLButtonElement>("Add If Odd")

  const incrementValueInput = screen.getByLabelText<HTMLInputElement>(
    "Set increment amount",
  )

  const incrementValueButton =
    screen.getByLabelText<HTMLButtonElement>("Increment value")

  await user.click(addIfOddButton)
  expect(countLabel).toHaveTextContent("0")

  await user.click(incrementValueButton)
  expect(countLabel).toHaveTextContent("1")

  await user.click(addIfOddButton)
  expect(countLabel).toHaveTextContent("3")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "1")
  await user.click(addIfOddButton)
  expect(countLabel).toHaveTextContent("4")

  await user.clear(incrementValueInput)
  await user.type(incrementValueInput, "-1")
  await user.click(addIfOddButton)
  expect(countLabel).toHaveTextContent("4")
})
