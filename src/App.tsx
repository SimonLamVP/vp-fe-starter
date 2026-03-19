import "./App.css"
import { Carts } from "./features/cart/Carts"
import { Products } from "./features/products/Products"

export const App = () => (
  <div className="App">
    <Carts />
    <Products />
  </div>
)
