import { css } from '@emotion/core';

import * as color from './color';

export const font = {
  arial: `Arial, sans-serif`,
  openSans: `"Open Sans", Arial, sans-serif`,
  roboto: `Roboto, Helvetica, sans-serif`
};

export const [light, normal, semibold, bold] = [300, 400, 500, 700];

export const withDot = css`
  color: ${color.greyish};

  &:before {
    display: inline-block;
    margin: 0 7px 1px;
    line-height: 1;

    content: '•';
    font-family: ${font.arial};
    font-weight: ${bold};
    color: ${color.lightGrey};
  }
`;

export const withLargeDot = css`
  ${withDot};

  &:before {
    font-size: 26px;
  }
`;
