import { Env } from './env';

export class Plausible {
  public static enabled() {
    if (process.env.NEXT_PUBLIC_ENABLE_PLAUSIBLE === 'false') return false;
    return Boolean(process.env.NEXT_PUBLIC_ENABLE_PLAUSIBLE);
  }

  public static domain() {
    if (Env.isMain()) return 'daopanel.chat';
    if (Env.isDevelop()) return 'devpanel.chat';
    return 'daopanel.local';
  }

  public static trackLocalhost() {
    if (process.env.NEXT_PUBLIC_TRACK_LOCALHOST === 'false') return false;
    return Boolean(process.env.NEXT_PUBLIC_TRACK_LOCALHOST);
  }
}
