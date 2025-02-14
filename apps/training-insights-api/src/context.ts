import * as trpc from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

export interface CreateContextOptions {
  // Add any context options needed
}

export async function createContext(opts: CreateContextOptions) {
  return {
    // Add context properties here
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;