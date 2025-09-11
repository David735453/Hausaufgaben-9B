import '../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject } from "@vercel/analytics"

inject();
injectSpeedInsights();

function MyApp({ Component, pageProps }) {
  return (
    <>
      
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;