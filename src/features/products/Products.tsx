import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import styles from "./Products.module.css"
import { selectFetchProductsRequestStatus } from "./productSelectors"
import { fetchProducts } from "./productThunks"
import { selectProducts } from "./productSlice"

const options = [5, 10, 20, 30]

export const Products = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfProducts, setNumberOfProducts] = useState(10)
  const products = useAppSelector(selectProducts)
  const request = useAppSelector(selectFetchProductsRequestStatus)

  useEffect(() => {
    void dispatch(fetchProducts(numberOfProducts))
  }, [dispatch, numberOfProducts])

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
      <h3>Select the Quantity of Products to Fetch:</h3>
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
      {products.map(product => (
        <article key={product.id} className={styles.productCard}>
          <h4>{product.title}</h4>
          <p className={styles.productMeta}>
            Brand: {product.brand ?? "N/A"} | Category: {product.category}
          </p>
          <p className={styles.productMeta}>
            Price: ${product.price.toFixed(2)} | Rating: {product.rating} |
            Stock: {product.stock}
          </p>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.tagList}>Tags: {product.tags.join(", ")}</p>
        </article>
      ))}
    </div>
  )
}
