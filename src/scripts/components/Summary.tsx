import * as React from 'react';
import styled from '@emotion/styled';

import * as color from '../@toggl/style/lib/color';
import * as text from '../@toggl/style/lib/text';

function Summary ({
  totals
}: {
  totals: {
    today: string,
    week: string
  }
}) {
  return (
    <SummaryRow>
      <div>This week: {totals.week}</div>
    </SummaryRow>
  )
}

const SummaryRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 30px;
  padding: 0 .8rem;

  color: ${color.black};
  font-weight: ${text.bold};
  font-size: 12px;
  margin-bottom: .25rem;
`;

export default Summary;
