import * as React from 'react';
import styled from '@emotion/styled';

export default function ContinueIcon (props: { title: string }) {
  return (
    <Wrapper>
      <Target {...props} />
      <svg width={12} height={16}>
        <path d="M0 2C0 0.9 0.8 0.5 1.7 1L11.3 7C12.2 7.5 12.2 8.5 11.3 9L1.7 15C0.8 15.5 0 15.1 0 14L0 2Z"/>
      </svg>
    </Wrapper>
  );
}

const Wrapper = styled.span`
  line-height: 0;
  padding-left: 1px;
  position: relative;

  & path {
    fill: var(--font-color);
    opacity: 0.5;
  }

  &:hover path {
    fill: var(--green);
    opacity: 1;
  }
`;

const Target = styled.div`
  position: absolute;
  width: 22px;
  left: -5px;
  height: 26px;
  top: -5px;
`
