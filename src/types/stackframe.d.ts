declare module "@stackframe/stack" {
  import * as React from "react";

  export const SignIn: React.FC<{ fullPage?: boolean; app?: any }>;
  export const SignUp: React.FC<{ fullPage?: boolean; app?: any }>;
  export const StackProvider: React.FC<{ app?: any; children?: React.ReactNode }>;
  export const StackTheme: React.FC<{ children?: React.ReactNode }>;
  export function useUser(): any;
  export class StackServerApp {
    constructor(opts: {
      tokenStore?: string;
      projectId?: string | undefined;
      publishableClientKey?: string | undefined;
      secretServerKey?: string | undefined;
    });
    getUser(): Promise<{ id: string } | null>;
  }
}
