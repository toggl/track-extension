import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Settings from './components/Settings'

// Store/data handled by background script
const { store } = chrome.extension.getBackgroundPage()

render(
  <Provider store={store}>
    <Settings />
  </Provider>,
  document.getElementById('root')
)
