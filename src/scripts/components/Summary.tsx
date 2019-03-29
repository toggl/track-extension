import * as React from 'react';
import styled from '@emotion/styled';
import browser from 'webextension-polyfill';

import * as color from '../@toggl/style/lib/color';
import * as text from '../@toggl/style/lib/text';

function Summary () {
  const totals = browser.extension.getBackgroundPage().TogglButton.calculateSums();

  return (
    <SummaryRow>
      <div>Today: {totals.today}</div>
      <div>This week: {totals.week}</div>
    </SummaryRow>
  )
}

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  padding: 0 .8rem;

  color: ${color.black};
  font-weight: ${text.bold};
  margin-bottom: .25rem;
`;

export default Summary;
