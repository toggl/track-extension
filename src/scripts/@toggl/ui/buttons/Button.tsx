import styled from '@emotion/styled';

import * as color from '../../style/lib/color';
import * as text from '../../style/lib/text';

const Button = styled.button`
  height: 36px;
  padding: 0 20px;

  color: ${color.black};
  text-align: center;
  font-size: ${text.regular};
  font-weight: ${text.normal};

  border: 1px solid ${color.extraLightGrey};
  border-radius: 8px;
  background-color: ${color.white};
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &.disabled {
    cursor: default;
  }
`;

export default Button;
