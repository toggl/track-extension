import * as React from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import browser from 'webextension-polyfill';

import bugsnagClient from '../lib/bugsnag';
import {
  Content,
  Row,
  Heading,
  Subheading,
  Button,
  CenteredButton,
  Link
} from '../@toggl/ui/components';
import Logo from '../icons/Logo';
import Spinner from './Spinner';
import QuickStartGuide from './QuickStartGuide';

export interface LoginProps {
  isLoggedIn: boolean;
  isPopup: boolean;
  source: 'web-login' | 'install' | 'quick-start';
}

interface LoginState {
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
}

async function login (setState: React.Dispatch<React.SetStateAction<LoginState>>) {
  setState({ loading: true, error: null, loggedIn: false });

  const { error, success: loggedIn } = await browser.runtime.sendMessage({
    type: 'sync',
    respond: true
  });

  setState({ loading: false, error, loggedIn });
}

export default function LoginPage ({ source, isLoggedIn, isPopup }: LoginProps) {
  const [ state, setState ] = React.useState<LoginState>({ loading: false, error: null, loggedIn: isLoggedIn });
  const { loading, error, loggedIn } = state;

  React.useEffect(() => {
    if (error) {
      bugsnagClient.notify(new Error(error), { context: 'login-page' });
    }
  }, [error]);

  React.useEffect(() => {
    if (source === 'web-login' && loading) document.title = 'Logging in to Toggl Button';
    if (source === 'web-login' && error) document.title = 'Could not login to Toggl Button';
    if (source === 'quick-start' || loggedIn) document.title = 'Welcome to Toggl Button';
  }, [source, loading, error, loggedIn]);

  let content = (
    <Content>
      <Row>
        <Heading>Nearly there!</Heading>
        <Subheading>Click the button below to login to your Toggl account</Subheading>
      </Row>
      <Row>
        <LoginButton isPopup={isPopup} />
        <SignupButton isPopup={isPopup} />
      </Row>
    </Content>
  );

  if (source === 'web-login') {
    if (!loggedIn && !loading && !error) {
      login(setState);
    }

    if (loading) {
      content = (
        <Content>
          <Row>
            <Heading>Logging you in</Heading>
          </Row>
          <Row>
            <CenteredButton>
              <Spinner />
            </CenteredButton>
          </Row>
        </Content>
      );
    }

    if (error) {
      content = (
        <Content>
          <Row>
            <Heading>Uh-oh.</Heading>
            <Subheading>Something went wrong...</Subheading>
          </Row>
          <Subheading>
            {error}
          </Subheading>
          <Row>
            <a href="login.html?source=install" style={{ marginBottom: 21 }}>
              <Button>Try again</Button>
            </a>
            <Subheading>or</Subheading>
            <a href="mailto:support@toggl.com" style={{ color: 'white' }}>
              <Subheading style={{ margin: 0 }}>Contact support</Subheading>
            </a>
          </Row>
        </Content>
      );
    }
  }

  if (source === 'quick-start' || loggedIn) {
    content = <QuickStartGuide />
  }

  return (
    <React.Fragment>
      <Global styles={page} />
      <Header style={{ display: 'flex' }}>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <HeaderLinks loggedIn={loggedIn} />
      </Header>
      <ContentWrapper>
        {content}
      </ContentWrapper>
    </React.Fragment>
  )
}

function HeaderLinks ({ loggedIn }: Pick<LoginState, 'loggedIn'>) {
  if (!loggedIn) {
    return null;
  }
  return (
    <Links>
      <li>
        <Link href="settings.html">
          Settings
        </Link>
      </li>
      <li>
        <Link href="settings.html?tab=integrations">
          Integrations
        </Link>
      </li>
      <li>
        <Link href="settings.html?tab=pomodoro">
          Pomodoro
        </Link>
      </li>
      <li>
        <Link href="settings.html?tab=telemetry">
          Telemetry
        </Link>
      </li>
      <li>
        <Link href="settings.html?tab=account">
          Account
        </Link>
      </li>
      <li>
        <Link href="https://support.toggl.com/browser-extensions">
          User Guide
        </Link>
      </li>
    </Links>
  );
}

function LoginButton ({ isPopup }: Pick<LoginProps, 'isPopup'>) {
  const url = `${process.env.TOGGL_WEB_HOST}/toggl-button-login/`;
  return (
    isPopup
    ? <a href='#' onClick={openPage(url)}><Button>Login</Button></a>
    : <a href={url}><Button>Login</Button></a>
  );
}

function SignupButton ({ isPopup }: Pick<LoginProps, 'isPopup'>) {
  const url = `${process.env.TOGGL_WEB_HOST}/signup/?utm_source=toggl-button&utm_medium=referral`;
  const style = { marginTop: 20 };
  return (
    isPopup
    ? <Link style={style} href='#' onClick={openPage(url)}>Create account</Link>
    : <Link style={style} href={url}>Create account</Link>
  );
}

const openPage = (url: string) => () => browser.tabs.create({ url });

const page = css`
  html, body, #app {
    font-family: GTWalsheim,Arial,sans-serif;
    margin: 0;
    background: #ca9eda;
    display: flex;
    flex-direction: column;
  }

  p {
    line-height: 1.71;
    font-weight: 500;
  }

  p.small {
    font-size: 13px;
    line-height: 1.1;
  }

  p.small a {
    line-height: 1.1;
    text-decoration: underline;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
  }

`;

const Header = styled.header`
  padding: 40px;
  justify-content: space-between;
 `;

const Links = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0;

  & li {
    margin-left: 25px;
    font-size: 13px;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoWrapper = styled.span`
  min-height: 36px;
  display: flex;
  align-items: center;

  & svg {
    fill: #282a2d;
  }
`;

