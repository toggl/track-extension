import * as React from 'react';

import logo from '../icons/logo.svg';

export default function LoginPage () {
  return (
    <React.Fragment>
      <header>
        {logo}
      </header>
      <main>
        <a href="https://ext-login-test.shantanu.now.sh">
          <button>
            Login
          </button>
        </a>
      </main>
    </React.Fragment>
  )
}
