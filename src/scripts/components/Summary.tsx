import * as React from 'react';
import styled from '@emotion/styled';

import * as text from '../@toggl/style/lib/text';

function Summary ({
  totals
}: {
  totals: {
    week: string
  }
}) {
  return (
    <SummaryRow>
      <div>THIS WEEK: {totals.week}</div>
    </SummaryRow>
  )
}

const SummaryRow = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 15px 28px;

  color: var(--summary-font-color);
  font-weight: ${text.bold};
  font-size: 12px;
  letter-spacing: 0.4px;
  line-height: 14px;
`;

export default Summary;
