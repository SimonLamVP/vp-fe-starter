import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectFetchCartsRequestStatus } from "../requestStatus/requestStatusSlice"
import styles from "./Carts.module.css"
import { fetchCarts, selectCarts } from "./cartSlice"

const options = [5, 10, 20, 30]

export const Carts = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfCarts, setNumberOfCarts] = useState(10)
  const carts = useAppSelector(selectCarts)
  const request = useAppSelector(selectFetchCartsRequestStatus)

  useEffect(() => {
    void dispatch(fetchCarts(numberOfCarts))
  }, [dispatch, numberOfCarts])

  if (request.status === "failed") {
    return (
      <div>
        <h1>{request.error ?? "There was an error!!!"}</h1>
      </div>
    )
  }

  if (request.status === "loading" || request.status === "idle") {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3>Select the Quantity of Carts to Fetch:</h3>
      <select
        className={styles.select}
        value={numberOfCarts}
        onChange={e => {
          setNumberOfCarts(Number(e.target.value))
        }}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {carts.map(cart => (
        <article key={cart.id} className={styles.cartCard}>
          <h4>Cart #{cart.id}</h4>
          <p className={styles.cartMeta}>
            User: {cart.userId} | Products: {cart.totalProducts} | Quantity:{" "}
            {cart.totalQuantity}
          </p>
          <p className={styles.cartMeta}>
            Total: ${cart.total.toFixed(2)} | Discounted: $
            {cart.discountedTotal.toFixed(2)}
          </p>
          <ul className={styles.productList}>
            {cart.products.map(product => (
              <li key={product.id}>
                {product.title} x {product.quantity}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
