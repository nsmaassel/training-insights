interface User {
  id: string;
  email: string;
}

export interface Context {
  user?: User;
}

export const createContext = async (): Promise<Context> => {
  // TODO: Implement actual user authentication
  return {};
};