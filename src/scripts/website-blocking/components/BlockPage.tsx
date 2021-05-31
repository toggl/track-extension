import * as React from "react";
import Timer from '../../components/Timer';
import styled from '@emotion/styled'
import browser from 'webextension-polyfill';

export default function TimerBlockPage({TogglButton}: { TogglButton: any }) {
  const [entry] = React.useState(TogglButton.$curEntry)
  const project = entry && TogglButton.findProjectByPid(entry.pid) || null;

  React.useEffect(() => {
    browser.runtime.onMessage.addListener(async (message) => {
      if (message.type === 'stopped') {
        let queryOptions = {active: true, currentWindow: true};
        let [tab] = await browser.tabs.query(queryOptions);
        browser.tabs.update(tab.id, {url: TogglButton.blockedSites[tab.id]})
      }
    })
  }, [])

  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get('from') || 'this page';

  return <Root>
    <TextWrapper>
      <Title>You shall not pass!</Title>
    </TextWrapper>

    <SubtitleWrapper>
      <Subtitle>You've blocked {url} while you're tracking your time,</Subtitle>
      <Subtitle>take a deep breath 🧘</Subtitle>
      <Subtitle>finish your task</Subtitle>
      <Subtitle>and try again.</Subtitle>
    </SubtitleWrapper>

    <Wrapper>
      <Timer entry={entry} project={project}></Timer>
    </Wrapper>
  </Root>
}

const Title = styled.h1`
  color: white;
  margin: 0 auto;
  font-size: 100px;
`

const Root = styled.div`
  background: url('../images/background.jpg');
  background-size: cover;
  height: 100vh;
`

const Wrapper = styled.div`
  max-width: 500px;
  margin-left: auto;
  margin-right: 100px;
  margin-top: 80px;
  background: white;
`

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding-top: 50px;
`

const SubtitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 50px;
  flex-direction: column;
`

const Subtitle = styled.h3`
  color: white;
  font-size: 25px;
  margin: 0;
  text-align: center;
`
