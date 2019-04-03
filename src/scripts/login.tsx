import * as React from 'react';
import { render } from 'react-dom';
import { getUrlParam } from './lib/utils';
import LoginPage, { LoginProps } from './components/LoginPage';

function init () {
  const source = (getUrlParam(location.href, 'source') || 'install') as LoginProps['source'];
  render(<LoginPage source={source} />, document.getElementById('app'));
}

init();
