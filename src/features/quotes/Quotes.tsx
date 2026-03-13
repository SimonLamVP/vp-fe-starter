import type { JSX } from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import styles from "./Quotes.module.css"
import {
  fetchQuotes,
  selectQuotes,
  selectQuotesError,
  selectQuotesStatus,
} from "./quotesSlice"

const options = [5, 10, 20, 30]

export const Quotes = (): JSX.Element | null => {
  const dispatch = useAppDispatch()
  const [numberOfQuotes, setNumberOfQuotes] = useState(10)
  const quotes = useAppSelector(selectQuotes)
  const status = useAppSelector(selectQuotesStatus)
  const error = useAppSelector(selectQuotesError)

  useEffect(() => {
    void dispatch(fetchQuotes(numberOfQuotes))
  }, [dispatch, numberOfQuotes])

  if (status === "failed") {
    return (
      <div>
        <h1>{error ?? "There was an error!!!"}</h1>
      </div>
    )
  }

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3>Select the Quantity of Quotes to Fetch:</h3>
      <select
        className={styles.select}
        value={numberOfQuotes}
        onChange={e => {
          setNumberOfQuotes(Number(e.target.value))
        }}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {quotes.map(({ author, quote, id }) => (
        <blockquote key={id}>
          &ldquo;{quote}&rdquo;
          <footer>
            <cite>{author}</cite>
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
