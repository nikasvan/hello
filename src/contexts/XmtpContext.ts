import { createContext } from 'react';
import { Client } from '@xmtp/xmtp-js';

export enum XmtpStatus {
  idle = 'idle',
  loading = 'waiting signature',
  denied = 'denied signature',
  ready = 'ready',
  somethingWentWrong = 'something went wrong!',
}

export interface XmtpContext {
  client: Client | null;
  init: () => Promise<void>;
  deinit: () => Promise<void>;
  status: XmtpStatus;
}

const Xmtp = createContext<XmtpContext>({
  client: null,
  init: async () => {
    null;
  },
  deinit: async () => {
    null;
  },
  status: XmtpStatus.idle,
});

export default Xmtp;
