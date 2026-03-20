import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectRequestStatus } from "../requestStatus/requestStatusSlice"
import styles from "./Products.module.css"
import { fetchProducts } from "./productThunks"
import { selectProducts } from "./productSelectors"

const options = [5, 10, 20, 30]

export const Products = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfProducts, setNumberOfProducts] = useState(10)
  const products = useAppSelector(selectProducts)
  const { error, status } = useAppSelector(state =>
    selectRequestStatus(state, fetchProducts.typePrefix),
  )

  useEffect(() => {
    void dispatch(fetchProducts(numberOfProducts))
  }, [dispatch, numberOfProducts])

  if (status === "failed") {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorLabel}>Product feed unavailable</p>
        <h3>{error ?? "There was an error!!!"}</h3>
      </div>
    )
  }

  if (status === "loading" || status === "idle") {
    return (
      <div className={styles.loadingState}>
        <div
          className={styles.spinner}
          role="status"
          aria-label="Loading products"
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div>
          <p className={styles.sectionLabel}>Showroom picks</p>
          <h3>Select the Quantity of Products to Fetch:</h3>
        </div>
        <select
          className={styles.select}
          value={numberOfProducts}
          onChange={e => {
            setNumberOfProducts(Number(e.target.value))
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
        {products.map(product => (
          <article key={product.id} className={styles.productCard}>
            <div className={styles.cardTopRow}>
              <span className={styles.categoryPill}>{product.category}</span>
              <span className={styles.stockPill}>Stock {product.stock}</span>
            </div>
            <h4>{product.title}</h4>
            <p className={styles.productMeta}>Brand: {product.brand ?? "N/A"}</p>
            <div className={styles.metricsRow}>
              <div>
                <span className={styles.metricLabel}>Price</span>
                <strong>${product.price.toFixed(2)}</strong>
              </div>
              <div>
                <span className={styles.metricLabel}>Rating</span>
                <strong>{product.rating}</strong>
              </div>
            </div>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.tagList}>Tags: {product.tags.join(", ")}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
