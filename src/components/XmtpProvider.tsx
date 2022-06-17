import React, {
  useState,
  useCallback,
  ReactElement,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { Client } from '@xmtp/xmtp-js';
import Xmtp, { XmtpStatus } from 'contexts/XmtpContext';
import { useSigner, useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { usePlausibleMetrics } from 'hooks';

function usePreviousString(value: string | undefined) {
  const ref = useRef<string | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  return ref.current;
}

const XmtpProvider = (props: { children: ReactElement }) => {
  const { data: wallet } = useSigner();
  const { data: accountData } = useAccount();
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const prevClientAddress = usePreviousString(client?.address);
  const [signatureDenied, setSignatureDenied] = useState<boolean | undefined>(
    undefined
  );
  const { recordXmtpInit } = usePlausibleMetrics();

  useEffect(() => {
    if (
      client !== null &&
      prevClientAddress !== undefined &&
      prevClientAddress !== accountData?.address
    )
      router.reload();
  }, [client, router, prevClientAddress, accountData]);

  const init = useCallback(async () => {
    if (wallet) {
      try {
        setSignatureDenied(false);
        const address = await wallet.getAddress();
        recordXmtpInit(address);
        const client = await Client.create(wallet);
        setClient(client);
      } catch (error) {
        setClient(null);
        setSignatureDenied(true);
      }
    } else {
      setClient(null);
    }
  }, [wallet]);

  const deinit = useCallback(async () => {
    setClient(null);
  }, []);

  const status = useMemo(() => {
    if (client === null && signatureDenied === undefined)
      return XmtpStatus.idle;
    if (client === null && signatureDenied === true) return XmtpStatus.denied;
    if (client === null) return XmtpStatus.loading;
    if (client !== null) return XmtpStatus.ready;
    return XmtpStatus.somethingWentWrong;
  }, [client, signatureDenied]);

  return (
    <Xmtp.Provider value={{ client, init, deinit, status }}>
      {props.children}
    </Xmtp.Provider>
  );
};

export default XmtpProvider;
