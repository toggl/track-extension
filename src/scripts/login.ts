import bugsnagClient from './lib/bugsnag';
import init from './initializers/login';

const root = document.getElementById('app');

if (root) {
  init(root);
} else {
  bugsnagClient.leaveBreadcrumb('Rendering login view');
  bugsnagClient.notify(new Error('Login: No root element found'));
}
