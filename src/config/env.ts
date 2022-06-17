const MAIN_BRANCH = 'main';
const DEVELOP_BRANCH = 'develop';

export class Env {
  public static isMain() {
    return Env.branch() === MAIN_BRANCH;
  }

  public static isDevelop() {
    return Env.branch() === DEVELOP_BRANCH;
  }

  public static isLocal() {
    return !(Env.isMain() || Env.isDevelop());
  }

  public static branch() {
    return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
  }

  public static author() {
    return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN;
  }

  public static domain() {
    if (Env.isMain()) return 'daopanel.chat';
    if (Env.isDevelop()) return 'devpanel.chat';
    return 'localhost:3000';
  }

  public static toString() {
    return `
      isMain: ${Env.isMain()}
      isDevelop: ${Env.isDevelop()}
      isLocal: ${Env.isLocal()}
      branch: ${Env.branch()}
      author: ${Env.author()}
    `;
  }
}
