import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

const animationYouSpinMeRound = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  border: solid 2px transparent;
  border-radius: 50%;
  border-top-color: #cdcdcd;
  border-left-color: #cdcdcd;
  border-width: 3px;

  width: 36px;
  height: 36px;

  box-sizing: border-box;
  animation: ${animationYouSpinMeRound} 400ms linear infinite;
`

export default Spinner;
