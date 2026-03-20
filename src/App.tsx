import "./App.css"
import { Carts } from "./features/cart/Carts"
import { Products } from "./features/products/Products"

export const App = () => (
  <main className="App">
    <header className="App-hero">
      <div className="App-brandRow">
        <span className="App-brandMark">VP</span>
        <span className="App-brandName">Victorian Plumbing</span>
      </div>
      <div className="App-heroContent">
        <div>
          <p className="App-kicker">Bathroom retail dashboard</p>
          <h1>Victorian Plumbing Redux with Thunks.</h1>
          <p className="App-intro">
            A project demonstrating the use of Redux Toolkit and Thunks to manage state
          </p>
        </div>
        <div className="App-statGrid" aria-label="Store highlights">
          <article className="App-statCard">
            <strong>Next day</strong>
            <span>Delivery-ready presentation</span>
          </article>
          <article className="App-statCard">
            <strong>Curated</strong>
            <span>Product-first shopping layout</span>
          </article>
          <article className="App-statCard">
            <strong>Trade feel</strong>
            <span>Bold panels and clear pricing data</span>
          </article>
        </div>
      </div>
    </header>

    <section className="App-grid">
      <section className="App-panel">
        <div className="App-titleBar">
          <p className="App-panelEyebrow">Basket snapshot</p>
          <div>
            <h2>Carts Explorer</h2>
            <p>See active order mixes and basket totals.</p>
          </div>
        </div>
        <Carts />
      </section>
      <section className="App-panel">
        <div className="App-titleBar">
          <p className="App-panelEyebrow">Range overview</p>
          <div>
            <h2>Products Explorer</h2>
            <p>Browse the current merchandise feed.</p>
          </div>
        </div>
        <Products />
      </section>
    </section>
  </main>
)
