import { css } from '@emotion/core';
import styled from '@emotion/styled';

import * as colors from '../../style/lib/color';
import * as text from '../../style/lib/text';

export const withDot = css`
  color: ${colors.greyish};

  &:before {
    display: inline-block;
    margin: 0 7px 1px;
    line-height: 1;

    content: '•';
    font-family: ${text.font.arial};
    font-weight: ${text.bold};
    color: ${colors.lightGrey};
  }
`;

export const withLargeDot = css`
  ${withDot};

  &:before {
    font-size: 26px;
  }
`;

export const ProjectLargeDot = styled.div`
  display: flex;
  align-items: center;

  ${text.withLargeDot};

  color: ${({ color }) => color || colors.lightGrey};

  &:before {
    color: ${({ color }) => color || colors.lightGrey};
    margin: 0 5px 0 0;
  }
`;

export const ProjectSmallDot = styled.div`
  display: flex;
  align-items: center;

  ${text.withDot};

  color: ${({ color }) => color || colors.lightGrey};

  &:before {
    color: ${({ color }) => color || colors.lightGrey};
    margin: 0 5px 0 0;
  }
`;
