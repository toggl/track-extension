import * as React from 'react';
import styled from '@emotion/styled';

import { Button } from '../@toggl/ui/components';
import Spinner from './Spinner';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<ButtonResponse | null>;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function LoginForm ({ onSubmit, onSuccess, onError }: LoginFormProps) {
  const [loading, setLoading] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const email = emailRef.current && emailRef.current.value;
      const password = passwordRef.current && passwordRef.current.value;

      if (!email || !password) return;

      setLoading(true);
      const response = await onSubmit(email, password);
      setLoading(false);

      if (!response) return;

      if (response.success) {
        onSuccess();
      } else {
        onError(response.error);
      }
    },
    [emailRef, passwordRef, onSubmit, setLoading]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="login-email">Email Address</Label>
        <Input
          ref={emailRef}
          id="login-email"
          name="email"
          type="email"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="username"
          spellCheck={false}
          pattern=".+@.+\..+$"
          autoFocus
          disabled={loading}
          required
        />
      </Field>
      <Field>
        <Label htmlFor="login-password">Password</Label>
        <Input
          ref={passwordRef}
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={loading}
          required
        />
      </Field>
      <Button>
        {loading && <Spinner />}
        {!loading && 'Log in'}
      </Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  width: 512px;
  padding: 96px 102px;
  background: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  flex-direction: column;
  & input:focus {
    border-color: #88cf8f;
  }
`;

const Input = styled.input`
  height: 72px;
  font-size: 21px;
  padding: 0 20px;

  background-color: #e3e8eb;
  border: .2rem solid #e3e8eb;
  border-radius: .4rem;
  box-shadow: none;
  color: #282a2d;
  display: block;
  outline: none;
  resize: none;
  transition: border-color .3s;
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.55px;
  line-height: 1.45;
  text-transform: uppercase;
  text-align: left;
  margin-bottom: 10px
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 42px
`;
