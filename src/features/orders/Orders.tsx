import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectFetchOrdersRequestStatus } from "../requestStatus/requestStatusSlice"
import styles from "./Orders.module.css"
import { fetchOrders, selectOrders } from "./ordersSlice"

const options = [5, 10, 20, 30]

export const Orders = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfOrders, setNumberOfOrders] = useState(10)
  const orders = useAppSelector(selectOrders)
  const request = useAppSelector(selectFetchOrdersRequestStatus)

  useEffect(() => {
    void dispatch(fetchOrders(numberOfOrders))
  }, [dispatch, numberOfOrders])

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
      <h3>Select the Quantity of Orders to Fetch:</h3>
      <select
        className={styles.select}
        value={numberOfOrders}
        onChange={e => {
          setNumberOfOrders(Number(e.target.value))
        }}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {orders.map(order => (
        <article key={order.id} className={styles.orderCard}>
          <h4>Order #{order.id}</h4>
          <p className={styles.orderMeta}>
            User: {order.userId} | Products: {order.totalProducts} | Quantity:{" "}
            {order.totalQuantity}
          </p>
          <p className={styles.orderMeta}>
            Total: ${order.total.toFixed(2)} | Discounted: $
            {order.discountedTotal.toFixed(2)}
          </p>
          <ul className={styles.productList}>
            {order.products.map(product => (
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
