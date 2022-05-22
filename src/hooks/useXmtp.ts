import Xmtp from 'contexts/XmtpContext';
import { useContext } from 'react';

export function useXmtp() {
  const context = useContext(Xmtp);
  if (context === undefined)
    throw new Error('This hook must be used inside an Xmtp.Provider');
  return context;
}
