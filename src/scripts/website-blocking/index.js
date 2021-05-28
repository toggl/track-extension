import browser from 'webextension-polyfill';
import * as React from 'react';
import ReactDOM from 'react-dom';
import BlockPage from './components/BlockPage';

const TogglButton = browser.extension.getBackgroundPage().TogglButton;

const rootElement = document.getElementById('root');
ReactDOM.render(<BlockPage TogglButton={TogglButton} />, rootElement);
