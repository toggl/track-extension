import * as React from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
import { getUrlParam } from '../lib/utils';
import LoginPage, { LoginProps } from '../components/LoginPage';

const TogglButton: TogglButton = browser.extension.getBackgroundPage().TogglButton;

export default function init (root: HTMLElement, isPopup = false) {
  const source = (getUrlParam(location.href, 'source') || 'install') as LoginProps['source'];
  render(<LoginPage isLoggedIn={!!TogglButton.$user} isPopup={isPopup} source={source} />, root);
}
