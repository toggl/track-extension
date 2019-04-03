import styled from '@emotion/styled';
import styles from '../../style';
// import { Checkbox } from '@toggl/ui'

const { color } = styles;

export const FieldContainer = styled.div`
  border-radius: ${styles.borderRadius};
  border: 1px solid
    ${props =>
    props.error || props.warning ? color.red : color.extraLightGrey};
  background-color: ${props =>
    props.active ? color.focusBackgroundLight : color.white};
  width: 100%;
  height: 100%;
`;

export const FieldError = styled.div`
  ${styles.text.error};
`;

export const FieldDescription = styled.div`
  ${styles.text.error};
  color: ${color.grey};
`;

export const TextInput = styled.input`
  ${styles.ui.form.input};
`;

export const TextArea = styled.textarea`
  ${styles.ui.form.input};
  resize: ${props => (!props.resize ? 'none' : 'both')};
`;
