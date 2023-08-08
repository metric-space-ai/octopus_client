import React from 'react';

import {ArrowPathIcon} from '@heroicons/react/24/solid';

import GithubIcon from '@/assets/icons/github.svg';

import {Button} from './buttons';
import {downloadAs} from '../helpers';
import Locale from '../locales';

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false, error: null, info: null};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Update state with error details
    this.setState({hasError: true, error, info});
  }

  clearAndSaveData() {
    try {
      downloadAs(JSON.stringify(localStorage), 'chatgpt-next-web-snapshot.json');
    } finally {
      localStorage.clear();
      location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Render error message
      return (
        <div className='error'>
          <h2>Oops, something went wrong!</h2>
          <pre>
            <code>{this.state.error?.toString()}</code>
            <code>{this.state.info?.componentStack}</code>
          </pre>

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <a href='' className='report'>
              <Button title='Report This Error' iconBefore={<GithubIcon />} />
            </a>
            <Button
              iconBefore={<ArrowPathIcon className='w-4 h-4' />}
              title='Clear All Data'
              onClick={() => confirm(Locale.Settings.Actions.ConfirmClearAll) && this.clearAndSaveData()}
            />
          </div>
        </div>
      );
    }
    // if no error occurred, render children
    return this.props.children;
  }
}
