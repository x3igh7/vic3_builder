import { css } from '@emotion/react';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-dark/theme.css';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <div css={css({ padding: '1rem' })}>
        <div css={css({ display: 'flex', gap: '1rem' })}>
          <Link href="/">Builder</Link>
          <Link href="/settings">Settings</Link>
        </div>
        <Component {...pageProps} />
      </div>
    </PrimeReactProvider>
  );
}
