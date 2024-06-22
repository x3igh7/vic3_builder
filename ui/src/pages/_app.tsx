import { css } from '@emotion/react';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-blue/theme.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <div css={css({ padding: '1rem' })}>
        <Component {...pageProps} />
      </div>
    </PrimeReactProvider>
  );
}
