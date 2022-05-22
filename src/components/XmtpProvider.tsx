import React, { useState, useCallback, ReactElement, useMemo } from 'react';
import { Client } from '@xmtp/xmtp-js';
import Xmtp, { XmtpStatus } from 'contexts/XmtpContext';
import { useSigner } from 'wagmi';

const XmtpProvider = (props: { children: ReactElement }) => {
  const { data: wallet } = useSigner();

  const [client, setClient] = useState<Client | null>(null);
  const [signatureDenied, setSignatureDenied] = useState<boolean | undefined>(
    undefined
  );

  const init = useCallback(async () => {
    if (wallet) {
      try {
        setSignatureDenied(false);
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
