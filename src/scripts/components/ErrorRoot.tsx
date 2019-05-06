import * as React from 'react';
import bugsnagClient from '../lib/bugsnag';

interface ErrorRootProps {
  breadcrumb?: string;
}

export default class ErrorRoot extends React.Component<ErrorRootProps, never> {
  componentDidCatch(error: Error) {
    bugsnagClient.notify(error);
  }

  componentDidMount() {
    const { breadcrumb } = this.props;
    if (breadcrumb) {
      bugsnagClient.leaveBreadcrumb(breadcrumb);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}
