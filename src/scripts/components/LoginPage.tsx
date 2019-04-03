import * as React from 'react';
import styled from '@emotion/styled';

import Logo from '../icons/Logo';
import Spinner from './Spinner';

export interface LoginProps {
  source: 'web-login' | 'install'
}

export default function LoginPage ({ source }: LoginProps) {
  const [ { loading }, setLoading ] = React.useState({ loading: true });

  let content = (
    <a href="https://ext-login-test.shantanu.now.sh">
      <Button>Login</Button>
    </a>
  );
  if (source === 'web-login' && loading) {
    content = (
      <CenteredButton>
        <Spinner />
      </CenteredButton>
    );
  } else if (source === 'web-login') {
    content = (
      <a href="settings.html?tab=account">
        <Button>Open Settings</Button>
      </a>
    );
  }

  setTimeout(() => setLoading({ loading: false }), 5000);

  return (
    <React.Fragment>
      <Header>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
      </Header>
      <ContentWrapper>
        {content}
      </ContentWrapper>
    </React.Fragment>
  )
}

const Header = styled.header`
  padding: 30px 24px;
`;

const ContentWrapper = styled.main`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoWrapper = styled.span`
  min-height: 36px;
  display: flex;
  align-items: center;

  & svg {
    fill: #282a2d;
  }
`;

const Button = styled.button`
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: center;
  background-color: #e24f54;
  border: 0;
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  line-height: 48px;
  min-width: 218px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  width: auto;
  padding: 0 15px;
  outline: none;
`;

const CenteredButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
