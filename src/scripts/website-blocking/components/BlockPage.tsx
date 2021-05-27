import * as React from "react";
import Timer from '../../components/Timer';
import styled from '@emotion/styled'

export default function Pomodoro({ TogglButton }: { TogglButton: any }) {
    const entry = TogglButton.$curEntry;
    const project = entry && TogglButton.findProjectByPid(entry.pid) || null;
    return <Root><Timer entry={entry} project={project}></Timer></Root>
}

const Root = styled.div`
    max-width: 700px;
    margin: 0 auto;
`