export default class Sentry {
  public static dsn = nullUnlessMainOrDevelop(
    process.env.NEXT_PUBLIC_SENTRY_DSN
  );
  public static environment = nullUnlessMainOrDevelop(
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
  );
  // Adjust this value in production, or use tracesSampler for greater control
  public static traceSampleRate = 1.0;
}

function nullUnlessMainOrDevelop<T>(value: T): T | null {
  const currentBranch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
  if (currentBranch === 'main' || currentBranch === 'develop') {
    return value;
  } else {
    return null;
  }
}
