import * as React from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
import { getUrlParam } from '../lib/utils';
import ErrorRoot from '../components/ErrorRoot';
import LoginPage, { LoginProps } from '../components/LoginPage';

const TogglButton: TogglButton = browser.extension.getBackgroundPage().TogglButton;

export default function init (root: HTMLElement, isPopup = false) {
  const source = (getUrlParam(location.href, 'source') || 'install') as LoginProps['source'];
  const isLoggedIn = !!TogglButton.$user;
  render(
    <ErrorRoot breadcrumb="Rendering Login page">
      <LoginPage isLoggedIn={isLoggedIn} isPopup={isPopup} source={source} />
    </ErrorRoot>,
    root
  )
}
