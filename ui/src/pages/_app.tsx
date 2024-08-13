import { css } from '@emotion/react';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-dark/theme.css';
import 'primeicons/primeicons.css';
import '../../i18n.config';
import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import Loading from '@/components/loading';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // remove any old settings from local storage
    Object.keys(localStorage).forEach(function (key) {
      // if not the current settings version, remove it
      if (key !== 'settings_v3') {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <PrimeReactProvider>
        <div css={css({ padding: '1rem' })}>
          <div css={css({ display: 'flex', gap: '1rem' })}>
            <Link href="/">Builder</Link>
            <Link href="/settings">Settings</Link>
          </div>
          <Component {...pageProps} />
        </div>
      </PrimeReactProvider>
    </Suspense>
  );
}
