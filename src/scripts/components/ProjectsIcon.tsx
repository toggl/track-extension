import * as React from 'react';
import styled from '@emotion/styled';

export default function ProjectsIcon ({ small }: { small?: boolean }) {
  return (
    /* <Icon width={16} height={13}> */
    <Icon width={small ? 14 : 16} height={small ? 11 : 13} viewBox='0 0 16 13'>
      <path
        d='M0 6h16v4.994A2.001 2.001 0 0114.006 13H1.994A1.993 1.993 0 010 10.994V6zm0-4a2 2 0 012.004-2h3.05c1.107 0 2.004.895 2.004 2h6.935C15.102 2 16 2.895 16 4H0V2z'
        fillRule='evenodd'
      />
    </Icon>
  )
}

const Icon = styled.svg`
  & > path {
    fill: var(--font-color);
    opacity: 0.5;
  }

  &:hover > path {
    opacity: 1;
  }
`;
