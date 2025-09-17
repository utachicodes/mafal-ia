import "server-only";

// Auth removed: minimal shim to preserve imports without pulling in Stack Auth.
export const stackServerApp = {
  async getUser(): Promise<null> {
    return null;
  },
};
