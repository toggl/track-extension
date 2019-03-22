import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import * as color from '../@toggl/style/lib/color';

export default function BillableIcon ({ active, theme }) {
  return (
    <Icon theme={themes[theme]} active={active} width={12} height={18}>
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

BillableIcon.defaultProps = {
  theme: 'greyLight'
}

const Icon = styled.svg`
  ${({ active, theme }) => css`
    opacity: ${active ? theme.activeOpacity : theme.defaultOpacity};

    & > path {
      stroke: ${active ? theme.activeColor : theme.color};
    }

    &:hover {
      & > path {
        stroke: ${active ? theme.activeHoverColor : theme.hoverColor};
      }
    }
  `};
`

const greyLightTheme = {
  defaultOpacity: 0,
  activeOpacity: 1,
  color: color.lightGrey,
  hoverColor: color.grey,
  activeColor: color.grey,
  activeHoverColor: color.black
}

const greenLightTheme = {
  defaultOpacity: 1,
  activeOpacity: 1,
  color: color.lightGrey,
  hoverColor: color.grey,
  activeColor: color.green,
  activeHoverColor: color.kermitGreenHover
}

const themes = {
  greyLight: greyLightTheme,
  greenLight: greenLightTheme
}
