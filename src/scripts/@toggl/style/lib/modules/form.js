import { css } from '@emotion/core';
import * as text from '../text';
import * as color from '../color';

export const input = css`
  ${text.bodyText};
  background-color: transparent;
  padding: 10px 12px !important;
  box-shadow: none !important;
  outline: none !important;
  border-radius: inherit;
  border: none;
  width: 100%;
  height: 100%;

  :placeholder {
    color: ${color.grey};
  }
`;
