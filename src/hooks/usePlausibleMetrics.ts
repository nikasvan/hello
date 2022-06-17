import { usePlausible } from 'next-plausible';
import { useCallback } from 'react';

export function usePlausibleMetrics() {
  const plausible = usePlausible();

  const recordXmtpInit = useCallback(
    (address: string) => {
      plausible('xmtpInitialized', {
        // Hash the address to avoid sending an PII
        props: sha256(address),
      });
    },
    [plausible]
  );

  return { recordXmtpInit };
}

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
