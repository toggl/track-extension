/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import browser from 'webextension-polyfill';

import { Content, Row, Heading, Subheading, Button, Link } from '../@toggl/ui/components';

const Arrow = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12l-18 12v-24z"/></svg>);

const closePage = async () => {
  const tab = await browser.tabs.getCurrent();
  browser.tabs.remove(tab.id);
};

export default function QuickStartGuide () {
  return (
    <Content>
      <Row>
        <Heading>Welcome to Toggl Button!</Heading>
        <Subheading>Track time from anywhere on the web.</Subheading>
      </Row>
      <Row>
        <a href="#quickstart">
          <Button>Get started</Button>
        </a>
      </Row>
      <Guide id="quickstart">
        <GuideHeading>
          <h2>Quick start</h2>
          <p>Toggl Button's top features and how to use them:</p>
        </GuideHeading>
        <div css={[section, right, salmon]}>
          <div>
            <div>
              <h5>Easy & fast</h5>
              <h3>Create time entries</h3>
              <p>Just click the "Play" icon to start tracking your first time entry!</p>
              <p>When you're done with your task, click on the "Stop" icon to save your entry.</p>
              <p>The Toggl Button popup shows a list of your recent time entries*. You can edit them from here.</p>
              <p>You can also enable useful time tracking features like idle detection and reminders from the Settings page.</p>
              <Link href="settings.html"><Button>Settings <Arrow/></Button></Link>
              <p className="small">*To see older time entries or run more complex reports, check out our web app at <Link href="https://toggl.com/app" target="_blank">toggl.com</Link>!</p>
            </div>
          </div>
          <div>
            <img src="../images/button-create.gif" />
          </div>
        </div>
        <div css={[section, left, gold]}>
          <div>
            <div>
              <h5>Supercharge your tools</h5>
              <h3>Use integrations</h3>
              <p>Add Toggl Button to 130+ tools for super fast time tracking!</p>
              <p>Once enabled, Toggl Button will show up inside the tool - just click on the Toggl Button icon to start a time entry.</p>
              <p>The description (and the project, if possible) will automatically be filled in for you.</p>
              <p>Check out the Integrations page now to see if your favourite tools are supported!</p>
              <Link href="settings.html?tab=integrations"><Button>Integrations <Arrow/></Button></Link>
            </div>
          </div>
          <div>
            <img src="../images/button-integrations.gif" />
          </div>
        </div>
        <div css={[section, right, green]}>
          <div>
            <div>
              <h5>Increase your productivity</h5>
              <h3>Pomodoro mode</h3>
              <p>Need help managing your time?</p>
              <p>Pomodoro® is a technique to help you focus on a task, by working hard for short intervals then taking a break.</p>
              <p>Toggl Button's pomodoro mode lets you set your interval length, and reminds you to take a break when time's up. You can also enable a ticking sound to help keep you on track.</p>
              <p>Turn it on from the Pomodoro page.</p>
              <Link href="settings.html?tab=pomodoro"><Button>Pomodoro <Arrow/></Button></Link>
            </div>
          </div>
          <div>
            <img src="../images/button-pomodoro.gif" />
          </div>
        </div>
      </Guide>
      <Spotty>
        <h2>100% Open Source</h2>
        <p>Want to help us make Toggl Button better?</p>
        <Link href="https://github.com/toggl/toggl-button/" target="_blank">
          <OSSParagraph>All our code is available on GitHub and we ❤ PRs!</OSSParagraph>
          <svg height="32" viewBox="0 0 16 16">
            <path  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </Link>
      </Spotty>
      <Row style={{ padding: '120px 0 40px 0'}}>
        <Button onClick={closePage}>Close page</Button>
      </Row>
    </Content>
  );
}

const Guide = styled.div`
  margin-top: 45px;
  padding: 85px 62px;
  background: rgb(227, 232, 235);
`;

const GuideHeading = styled.div`
  padding-left: 8.3%;

  h2, p {
    margin: 0;
    padding: 0;
  }

  h2 {
    font-size: 30px;
    line-height: 1.42;
  }

  p {
    font-size: 15px;
  }
`;

const section = css`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 80px;
  padding: 55px;

  & > div:first-of-type {
    width: 47%;
    margin-top: -87px;
    font-size: 15px;

    & > div {
      padding: 40px 60px;
      box-sizing: border-box;
      background: white;
      border-radius: 4px;
    }

    h5 {
      font-size: 12px;
      text-transform: uppercase;
      margin: 0 0 10px 0;
    }

    h3 {
      font-size: 24px;
      margin: 0 0 20px 0;
    }

    Button {
      background: white;
      color: rgb(40, 42, 45);
      border: 3px solid rgb(241,244,246);
      transition: background 0.4s;
    }

    Button:hover {
      background: rgb(241,244,246);
    }

    Button svg {
      width: 8px;
      margin-left: 10px;
      transition: all 0.2s ease-in;
    }

    Button:hover svg {
      width: 10px;
      margin-left: 8px;
    }
  }

  & > div:last-of-type {
    max-width: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    max-width: 100%;
  }
`;

const left = css`
  padding-left: 8.7%;

  & > div:first-of-type {
    order: -1;
  }
`;

const right = css`
  padding-right: 8.7%;

  & > div:first-of-type {
    order: 1;
  }
`;

const salmon = css`
  background: rgb(255, 172, 186);

  h5 {
    color: rgb(227, 103, 124);
  }
`;

const gold = css`
  background: rgb(248, 206, 106);

  h5 {
    color: rgb(246, 159, 9);
  }
`;

const green = css`
  background: rgb(136, 207, 143);

  h5 {
    color: rgb(49, 170, 83);
  }
`;

const Spotty = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 85px;
  background: url('../images/spotty.png') rgb(254,238,222);
  text-align: center;

  h2 {
    font-size: 30px;
  }

  p {
    font-size: 18px;
    margin-top: 0;
  }
`;

const OSSParagraph = styled.p`
  color: #DD6FD1;
`
