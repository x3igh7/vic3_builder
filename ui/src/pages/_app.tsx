import { css } from '@emotion/react';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-dark/theme.css';
import 'primeicons/primeicons.css';
import '../../i18n.config';
import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import Loading from '@/components/loading';
import { Button } from 'primereact/button';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // remove any old settings from local storage
    Object.keys(localStorage).forEach(function (key) {
      // if not the current settings version, remove it
      if (key !== 'settings_v4') {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <PrimeReactProvider>
        <div css={css({ padding: '1rem' })}>
          <div css={css({ display: 'flex', gap: '1rem' })}>
            <Link href="/">
              <Button icon="pi pi-wrench" label="Builder" text />
            </Link>
            <Link href="/settings">
              <Button icon="pi pi-cog" label="Production Methods" text />
            </Link>
            <Link href="https://github.com/x3igh7/vic3_builder/issues">
              <Button icon="pi pi-exclamation-triangle" label="Issues" text />
            </Link>
          </div>
          <Component {...pageProps} />
        </div>
      </PrimeReactProvider>
    </Suspense>
  );
}
