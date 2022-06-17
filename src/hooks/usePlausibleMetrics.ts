import { usePlausible } from 'next-plausible';
import { useCallback } from 'react';

export function usePlausibleMetrics() {
  const plausible = usePlausible();

  const recordXmtpInit = useCallback(
    (address: string) => {
      const hash = sha256(address);
      console.log('Address hash:', hash);
      plausible('xmtpInit', {
        // Hash the address to avoid sending an PII
        props: { hashOfAddress: hash },
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
