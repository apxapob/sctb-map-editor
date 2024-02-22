import React, { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'
import { Initialize } from './state/actions/Initialization'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://c3784b48fc167181943ce8579af9a33c@o4506785594802176.ingest.sentry.io/4506785596768256",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

Initialize()

const container = document.getElementById('root')
if (container !== null) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  console.error('No root element.')
}
