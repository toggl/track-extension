import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Popup from './components/Popup'

// Store/data handled by background script
const { store } = chrome.extension.getBackgroundPage()

render(
  <Provider store={store}>
    <Popup />
  </Provider>,
  document.getElementById('root')
)
