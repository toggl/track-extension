import React from 'react';
import styled from '@emotion/styled';
import * as color from '../@toggl/style/lib/color';

const Wrapper = styled.span`
  line-height: 0;
`;

export default function TagsIcon (props) {
  return (
    <Wrapper {...props}>
      <Icon width={17} height={16}>
        <path
          d='M0 6c0 1.1.6 2.6 1.4 3.4l6.2 6.2c.8.8 2 .8 2.8 0l5.2-5.2c.8-.8.8-2 0-2.8L9.4 1.4C8.6.6 7.1 0 6 0H2C.9 0 0 .9 0 2v4zm4 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'
          fill={color.grey}
          fillRule='evenodd'
        />
      </Icon>
    </Wrapper>
  );
}

const Icon = styled.svg`
  &:hover > path {
    fill: ${color.grey};
  }
`;
