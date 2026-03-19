import "./App.css"
import { Carts } from "./features/cart/Carts"
import { Products } from "./features/products/Products"

export const App = () => (
  <div className="App">
    <section className="App-panel">
      <div className="App-titleBar">
        <span>Carts Explorer</span>
      </div>
      <Carts />
    </section>
    <section className="App-panel">
      <div className="App-titleBar">
        <span>Products Explorer</span>
      </div>
      <Products />
    </section>
  </div>
)
