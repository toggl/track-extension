import * as React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

export default function BillableIcon ({ active }: {
  active: boolean
}) {
  return (
    <Icon active={active} width={12} height={18}>
      <path
        d='M2.5 12C3 13.5 4 14.5 6 14.5s3.5-1.2 3.5-2.7c0-4-7-1.6-7-5.6C2.5 4.7 4 3.5 6 3.5c1.5 0 3 1 3.5 2.5M6 2v14'
        fill='none'
        fillRule='evenodd'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
      />
    </Icon>
  )
}

const Icon = styled.svg<{ active: boolean }>`
  ${({ active }) => css`
    opacity: ${active ? 1 : 0};

    & > path {
      stroke: var(--font-color);
      opacity: 0.5;
    }

    &:hover {
      & > path {
        opacity: 1;
      }
    }
  `};
`
