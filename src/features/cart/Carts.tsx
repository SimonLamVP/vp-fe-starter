import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectRequestStatus } from "../requestStatus/requestStatusSlice"
import styles from "./Carts.module.css"
import { fetchCarts } from "./cartThunks"
import { selectCarts } from "./cartSelectors"

const options = [5, 10, 20, 30]

export const Carts = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfCarts, setNumberOfCarts] = useState(10)
  const carts = useAppSelector(selectCarts)
  const { error, status } = useAppSelector(state =>
    selectRequestStatus(state, fetchCarts.typePrefix),
  )

  useEffect(() => {
    void dispatch(fetchCarts(numberOfCarts))
  }, [dispatch, numberOfCarts])

  if (status === "failed") {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorLabel}>Basket feed unavailable</p>
        <h3>{error ?? "There was an error!!!"}</h3>
      </div>
    )
  }

  if (status === "loading" || status === "idle") {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} role="status" aria-label="Loading carts" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div>
          <p className={styles.sectionLabel}>Open baskets</p>
          <h3>Select the Quantity of Carts to Fetch:</h3>
        </div>
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
      </div>
      <div className={styles.cardGrid}>
        {carts.map(cart => (
          <article key={cart.id} className={styles.cartCard}>
            <div className={styles.cardTopRow}>
              <h4>Cart #{cart.id}</h4>
              <span className={styles.orderPill}>User {cart.userId}</span>
            </div>
            <div className={styles.metricsRow}>
              <div>
                <span className={styles.metricLabel}>Products</span>
                <strong>{cart.totalProducts}</strong>
              </div>
              <div>
                <span className={styles.metricLabel}>Quantity</span>
                <strong>{cart.totalQuantity}</strong>
              </div>
              <div>
                <span className={styles.metricLabel}>Total</span>
                <strong>${cart.total.toFixed(2)}</strong>
              </div>
              <div>
                <span className={styles.metricLabel}>Discounted</span>
                <strong>${cart.discountedTotal.toFixed(2)}</strong>
              </div>
            </div>
            <ul className={styles.productList}>
              {cart.products.map(product => (
                <li key={product.id}>
                  <span>{product.title}</span>
                  <strong>x {product.quantity}</strong>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
