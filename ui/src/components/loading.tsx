import { ReactElement } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = (): ReactElement => {
  return <ProgressSpinner aria-label="Loading" />;
};

export default Loading;
