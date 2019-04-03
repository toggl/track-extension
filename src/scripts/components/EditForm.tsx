import * as React from 'react';

import { FieldContainer, TextInput } from '../@toggl/ui/fields';

type EditFormProps = {
  billable: boolean;
  description: string;
  duration?: string;
  projectId?: number;
  tags?: string[];
  taskId?: number;
  workspaceId: number;
};

export default function EditForm (props: EditFormProps) {
  return (
    <div>

      {props.duration && <p>[duration]</p>}

      <FieldContainer>
        <TextInput value={props.description} />
      </FieldContainer>

      <button>OK</button>

    </div>
  )
}
