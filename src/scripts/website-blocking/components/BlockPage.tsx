import * as React from "react";
import Timer from '../../components/Timer';
import styled from '@emotion/styled'

export default function Pomodoro({ TogglButton }: { TogglButton: any }) {
    const entry = TogglButton.$curEntry;
    const project = entry && TogglButton.findProjectByPid(entry.pid) || null;
    return <Root>
        <TextWrapper>
            <Title>You shall not pass!</Title>
        </TextWrapper>

        <SubtitleWrapper>
            <Subtitle>You've blocked [url] while you're tracking your time,</Subtitle>
            <Subtitle>take a deep breath 🧘</Subtitle>
            <Subtitle>finish your task</Subtitle>
            <Subtitle>and try again.</Subtitle>
        </SubtitleWrapper>

        <Wrapper><Timer entry={entry} project={project}></Timer></Wrapper>
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
    justift-content: center;
    width: 100%;
    padding-top: 50px;
`

const SubtitleWrapper = styled.div`
    display: flex;
    justift-content: center;
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