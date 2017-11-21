// Establish store
// Connect to websockets
import { createStore } from 'redux'
import * as domains from './lib/domains'

// Save to window allowing the html context access
const store = window.store = createStore((state = {}, action) => {
  console.log(action)
  return state
})

store.dispatch({ type: 'APP_INIT' })
console.log(domains)
